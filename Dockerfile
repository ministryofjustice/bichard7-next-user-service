ARG NODE_IMAGE="node:15.9"

# Build user-service app

FROM ${NODE_IMAGE} as app_builder

LABEL maintainer="CJSE"

WORKDIR /src/user-service

COPY ./package*.json ./
COPY ./scripts/ ./scripts/
RUN npm install

COPY . ./

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM ${NODE_IMAGE} as cert_generator

WORKDIR /certs

RUN yum update -y && \
    yum install -y openssl

RUN openssl req -newkey rsa:4096 \
    -x509 \
    -sha256 \
    -days 3650 \
    -nodes \
    -out server.crt \
    -keyout server.key \
    -subj "/CN=localhost"

# Run user-service app

FROM ${NODE_IMAGE} as runner

RUN yum update -y && \
    amazon-linux-extras install -y epel && \
    yum install -y \
        supervisor \
        nginx \
        shadow-utils

RUN useradd nextjs
RUN groupadd nodejs
RUN usermod -a -G nodejs nextjs

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

WORKDIR /app
COPY ./package*.json ./
RUN npm install --production --ignore-scripts

COPY --from=app_builder /src/user-service/next.config.js ./
COPY --from=app_builder /src/user-service/public ./public
COPY --from=app_builder --chown=nextjs:nodejs /src/user-service/.next ./.next

COPY --from=cert_generator /certs /certs

COPY docker/conf/nginx.conf /etc/nginx/nginx.conf
COPY docker/conf/supervisord.conf /etc/supervisord.conf

EXPOSE 80
EXPOSE 443

CMD [ "/usr/bin/supervisord", "-c", "/etc/supervisord.conf" ]
