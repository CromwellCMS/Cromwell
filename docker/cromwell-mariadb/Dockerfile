# syntax=docker/dockerfile:1
FROM mariadb:latest

COPY ./cromwell /app
COPY ./nginx.conf /app/nginx.conf

RUN apt update && apt install nginx curl -y \
    && curl -sL https://deb.nodesource.com/setup_14.x -o nodesource_setup.sh \
    && bash nodesource_setup.sh \
    && apt install nodejs -y \
    && mkdir -p /.cromwell/nginx \
    && mkdir -p /run/nginx \
    && npm i @cromwell/cli -g \
    && crw create app \
    && cd app \
    && npx crw s --sv r --try \
    && npx crw s --sv a --try

VOLUME ["/app/public", "/app/nginx", "/app/.cromwell/server", "/app/.cromwell/logs"]
EXPOSE 80
CMD  cd app && node entrypoint.js