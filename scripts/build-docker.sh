#!/usr/bin/env bash

FETCHED_AWS_ACCOUNT_ID=$(aws sts get-caller-identity \
    --query 'Account' \
    --output text \
    2> /dev/null
)

AWS_STATUS=$?
if [[ $AWS_STATUS -ne 0 ]]; then
    echo "Unable to authenticate with AWS - are you running this with aws-vault?" >&2
    exit $AWS_STATUS
fi

set -e

echo "Building user-service docker image on `date`"

if [[ -z "${AWS_ACCOUNT_ID}" ]]; then
    AWS_ACCOUNT_ID=$FETCHED_AWS_ACCOUNT_ID
fi

aws ecr get-login-password --region eu-west-2 | docker login \
    --username AWS \
    --password-stdin \
    "${AWS_ACCOUNT_ID}.dkr.ecr.eu-west-2.amazonaws.com"

# Get our latest staged nodejs image
IMAGE_HASH=$(aws ecr describe-images \
    --repository-name nginx-nodejs-supervisord \
    --query 'to_string(sort_by(imageDetails,& imagePushedAt)[-1].imageDigest)' \
    --output text
)

DOCKER_IMAGE_HASH="${AWS_ACCOUNT_ID}.dkr.ecr.eu-west-2.amazonaws.com/nginx-nodejs-supervisord@${IMAGE_HASH}"

docker build --build-arg "BUILD_IMAGE=${DOCKER_IMAGE_HASH}" -t user-service .

if [[ -n "${CODEBUILD_RESOLVED_SOURCE_VERSION}" && -n "${CODEBUILD_START_TIME}" ]]; then

    ## Install goss/trivy
    curl -L https://github.com/aelsabbahy/goss/releases/latest/download/goss-linux-amd64 -o /usr/local/bin/goss
    chmod +rx /usr/local/bin/goss
    curl -L https://github.com/aelsabbahy/goss/releases/latest/download/dgoss -o /usr/local/bin/dgoss
    chmod +rx /usr/local/bin/dgoss

    export GOSS_PATH="/usr/local/bin/goss"

    get_latest_release() {
      curl --silent "https://api.github.com/repos/$1/releases/latest" | # Get latest release from GitHub api
        grep '"tag_name":' |                                            # Get tag line
        sed -E 's/.*"([^"]+)".*/\1/'                                    # Pluck JSON value
    }

    install_trivy() {
      echo "Installing trivy binary"
      TRIVY_VERSION=$(get_latest_release "aquasecurity/trivy" | sed 's/v//')
      yum install -y https://github.com/aquasecurity/trivy/releases/download/v${TRIVY_VERSION}/trivy_${TRIVY_VERSION}_Linux-64bit.rpm
    }

    install_trivy

    ## Run goss tests
    GOSS_SLEEP=15 dgoss run -e DB_HOST=172.17.0.1 "user-service:latest"
    ## Run Trivy scan
    trivy image "user-service:latest"

    docker tag \
        user-service:latest \
        ${AWS_ACCOUNT_ID}.dkr.ecr.eu-west-2.amazonaws.com/user-service:${CODEBUILD_RESOLVED_SOURCE_VERSION}-${CODEBUILD_START_TIME}

    echo "Push docker image on `date`"
    docker push \
        ${AWS_ACCOUNT_ID}.dkr.ecr.eu-west-2.amazonaws.com/user-service:${CODEBUILD_RESOLVED_SOURCE_VERSION}-${CODEBUILD_START_TIME} | tee /tmp/docker.out
    export IMAGE_SHA_HASH=$(cat /tmp/docker.out | grep digest | cut -d':' -f3-4 | cut -d' ' -f2)

    if [ "${IS_CD}" = "true" ]; then
      cat <<EOF>/tmp/user-service.json
      {
        "source-hash" : "${CODEBUILD_RESOLVED_SOURCE_VERSION}",
        "build-time": "${CODEBUILD_START_TIME}",
        "image-hash": "${IMAGE_SHA_HASH}"
      }
EOF

    aws s3 cp /tmp/user-service.json ${ARTIFACT_BUCKET}/semaphores/user-service.json
    fi
fi
