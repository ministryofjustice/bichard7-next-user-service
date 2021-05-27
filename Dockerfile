ARG NODE_IMAGE="node:latest"
FROM ${NODE_IMAGE}

LABEL maintainer="CJSE"

WORKDIR /user-service

COPY ./package*.json /user-service/
COPY ./scripts/ /user-service/scripts
RUN npm install --production

COPY . /user-service/

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]
