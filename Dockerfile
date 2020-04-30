FROM node:alpine as client

WORKDIR /client

COPY package.json yarn.lock README.md ./

RUN yarn

COPY ./public ./public

COPY ./src ./src

ENV REACT_APP_API_GATEWAY_URL=<api-gateway>:<port>

RUN yarn build

FROM nginx:latest

LABEL maintainer=Ishan-Shukla

COPY --from=client /client/build/ /usr/share/nginx/html

EXPOSE 80