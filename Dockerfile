FROM node:alpine as client

WORKDIR /client

COPY package.json yarn.lock README.md ./

RUN apk --no-cache add --virtual native-deps \
  g++ gcc libgcc libstdc++ linux-headers make python && \
  npm install node-gyp -g &&\
  yarn && \
  apk del native-deps

COPY ./public ./public

COPY ./src ./src

RUN yarn build

FROM nginx:latest

LABEL maintainer=Ishan-Shukla

COPY --from=client /client/build/ /usr/share/nginx/html

EXPOSE 80