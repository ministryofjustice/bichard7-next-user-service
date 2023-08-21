ARG BUILD_IMAGE="nginx-nodejs-2023-supervisord"

# Build user-service app

FROM ${BUILD_IMAGE} as app_builder

LABEL maintainer="CJSE"

WORKDIR /src/user-service

COPY ./package*.json ./
COPY ./scripts/ ./scripts/
COPY ./public/ ./public/

RUN yum groupinstall -y "Development Tools" && \
    amazon-linux-extras install -y python3.8 && \
    ln -sf /usr/bin/python3.8 /usr/bin/python3 && \
    npm install && \
    npm run install:assets

COPY . ./

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build
RUN npm ci --production

# Run user-service app

FROM ${BUILD_IMAGE} as runner

RUN useradd nextjs && \
    groupadd nodejs && \
    usermod -a -G nodejs nextjs && \
    npm config set cache /tmp/npm --global

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

WORKDIR /app
COPY ./package*.json ./

COPY --from=app_builder /src/user-service/next.config.js ./
COPY --from=app_builder /src/user-service/public ./public
COPY --from=app_builder /src/user-service/node_modules node_modules
COPY --from=app_builder --chown=nextjs:nodejs /src/user-service/.next ./.next

COPY docker/conf/nginx.conf /etc/nginx/nginx.conf
COPY docker/conf/supervisord.conf /etc/supervisord.conf

EXPOSE 80
EXPOSE 443

CMD [ "/usr/bin/supervisord", "-c", "/etc/supervisord.conf" ]
