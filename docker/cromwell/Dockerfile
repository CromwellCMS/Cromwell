# syntax=docker/dockerfile:1
FROM node:14-alpine

COPY ./cromwell /app
COPY ./nginx.conf /app/nginx.conf

RUN apk add nginx --update-cache \
    && mkdir -p /run/nginx \ 
    && npm i @cromwell/cli -g \
    && crw create app \
    && cd app \
    && npx crw s --sv r --try \
    && npx crw s --sv a --try

VOLUME ["/app/public", "/app/nginx", "/app/.cromwell/server", "/app/.cromwell/logs"]
EXPOSE 80
CMD  cd app && node entrypoint.js