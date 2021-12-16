FROM mariadb:latest

COPY ./cromwell-mariadb /app
COPY ./nginx.conf /app/nginx.conf

RUN apt update && apt install nginx curl python ca-certificates libssl-dev apt-transport-https -y \
    && curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh \
    && bash nodesource_setup.sh \
    && apt install nodejs -y

RUN mkdir -p /.cromwell/nginx \
    && mkdir -p /run/nginx \
    && npm i @cromwell/cli -g \
    && crw create app \
    && cd app \
    && npx crw s --sv r --try \
    && npx crw s --sv a --try \
    && rm -rf /app/.cromwell/server \
    && rm -rf /app/.cromwell/logs \
    && rm -rf /app/.cromwell/manager

VOLUME ["/app/public", "/app/nginx", "/app/.cromwell/server", "/app/.cromwell/logs"]
EXPOSE 80
CMD  cd app && node entrypoint.js
