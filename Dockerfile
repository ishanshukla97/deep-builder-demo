FROM node:alpine as client

WORKDIR /app

COPY . .

RUN yarn install --frozen-lockfile && yarn build

FROM nginx:latest

COPY --from=client /app/build/ /usr/share/nginx/html
