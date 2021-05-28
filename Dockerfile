ARG NODE_IMAGE="node:latest"

# Build user-service app

FROM ${NODE_IMAGE} as builder

LABEL maintainer="CJSE"

WORKDIR /src/user-service

COPY ./package*.json ./
COPY ./scripts/ ./scripts/
RUN npm install

COPY . ./

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Run user-service app

FROM ${NODE_IMAGE} as runner

RUN useradd nextjs
RUN groupadd nodejs
RUN usermod -a -G nodejs nextjs

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

WORKDIR /app
COPY ./package*.json ./
RUN npm install --production --ignore-scripts

COPY --from=builder /src/user-service/next.config.js ./
COPY --from=builder /src/user-service/public ./public
COPY --from=builder --chown=nextjs:nodejs /src/user-service/.next ./.next

USER nextjs

EXPOSE 3000

CMD [ "npm", "start" ]
