# Creates the CAP-KAFKA-GATEWAY.
#
# You can access the container using:
#   docker run -it cap-kafka-gateway sh
# To start it stand-alone:
#   docker run -it cap-kafka-gateway

FROM node:14-alpine as builder
# Install dependencies via apk
RUN apk update && apk add python make g++ && rm -rf /var/cache/apk/*
RUN mkdir -p ./code
COPY package.json /code/package.json
WORKDIR /code
RUN npm i
COPY ./tsconfig.json .
ADD ./src ./src/
RUN npm run build

FROM node:14-alpine
RUN mkdir -p /app
WORKDIR /app
COPY ./package.json ./package.json
COPY --from=builder /code/dist .
COPY package.json ./package.json
RUN npm i --only=prod
CMD ["node", "index.js"]
