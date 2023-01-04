ARG BUILD_IMAGE="nginx-nodejs-supervisord"

# Build user-service app

FROM ${BUILD_IMAGE} as app_builder

LABEL maintainer="CJSE"

WORKDIR /src/user-service

COPY ./package*.json ./
COPY ./scripts/ ./scripts/
COPY ./public/ ./public/

RUN npm install && \
    npm run install:assets

COPY . ./

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

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

RUN npm install --production

COPY --from=app_builder /src/user-service/next.config.js ./
COPY --from=app_builder /src/user-service/public ./public
COPY --from=app_builder --chown=nextjs:nodejs /src/user-service/.next ./.next

COPY docker/conf/nginx.conf /etc/nginx/nginx.conf
COPY docker/conf/supervisord.conf /etc/supervisord.conf

EXPOSE 80
EXPOSE 443

CMD [ "/usr/bin/supervisord", "-c", "/etc/supervisord.conf" ]
