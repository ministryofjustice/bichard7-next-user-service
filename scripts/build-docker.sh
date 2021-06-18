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
    --repository-name nodejs \
    --query 'to_string(sort_by(imageDetails,& imagePushedAt)[-1].imageDigest)' \
    --output text
)

DOCKER_IMAGE_HASH="${AWS_ACCOUNT_ID}.dkr.ecr.eu-west-2.amazonaws.com/nodejs@${IMAGE_HASH}"

docker build --build-arg "NODE_IMAGE=${DOCKER_IMAGE_HASH}" -t user-service .

if [[ -n "${CODEBUILD_RESOLVED_SOURCE_VERSION}" && -n "${CODEBUILD_START_TIME}" ]]; then
    docker tag \
        user-service:latest \
        ${AWS_ACCOUNT_ID}.dkr.ecr.eu-west-2.amazonaws.com/user-service:${CODEBUILD_RESOLVED_SOURCE_VERSION}-${CODEBUILD_START_TIME}

    echo "Push docker image on `date`"
    docker push \
        ${AWS_ACCOUNT_ID}.dkr.ecr.eu-west-2.amazonaws.com/user-service:${CODEBUILD_RESOLVED_SOURCE_VERSION}-${CODEBUILD_START_TIME}
fi
