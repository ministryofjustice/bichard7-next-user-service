ARG BUILD_IMAGE="nginx-nodejs-supervisord"

# Build user-service app

FROM ${BUILD_IMAGE} as app_builder

LABEL maintainer="CJSE"

WORKDIR /src/user-service

RUN yum install -y node-gyp

COPY ./package*.json ./
COPY ./scripts/ ./scripts/
RUN npm install

COPY . ./

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Run user-service app

FROM ${BUILD_IMAGE} as runner

RUN useradd nextjs
RUN groupadd nodejs
RUN usermod -a -G nodejs nextjs

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

WORKDIR /app
COPY ./package*.json ./

# We built argon2 from source in the builder image, so copy it here
COPY --from=app_builder /src/user-service/node_modules/argon2 ./node_modules/argon2

RUN npm install --production --ignore-scripts

COPY --from=app_builder /src/user-service/next.config.js ./
COPY --from=app_builder /src/user-service/public ./public
COPY --from=app_builder --chown=nextjs:nodejs /src/user-service/.next ./.next

COPY docker/conf/nginx.conf /etc/nginx/nginx.conf
COPY docker/conf/supervisord.conf /etc/supervisord.conf

EXPOSE 80
EXPOSE 443

CMD [ "/usr/bin/supervisord", "-c", "/etc/supervisord.conf" ]
