FROM node:9-alpine as builder
RUN yarn global add @vue/cli-service-global

RUN apk update
RUN apk add --no-cache make gcc g++ python mc htop nano openssl
RUN apk add --update ffmpeg

RUN mkdir /usr/app
WORKDIR /usr/app
COPY server/ .
RUN yarn add @babel/core@^7.0.0-0
RUN yarn install

RUN mkdir /usr/front
WORKDIR /usr/front
COPY vue-front/ .
RUN yarn install
RUN yarn build

RUN mkdir -p /usr/app/public
RUN cp -a /usr/front/dist/. /usr/app/public/
WORKDIR /usr/app
CMD ["node","index.js"]