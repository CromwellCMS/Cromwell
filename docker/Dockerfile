# syntax=docker/dockerfile:1
FROM mariadb:latest

COPY . .

RUN apt update && apt install nginx curl -y \
    && curl -sL https://deb.nodesource.com/setup_14.x -o nodesource_setup.sh \
    && bash nodesource_setup.sh \
    && apt install nodejs -y \
    && mkdir -p /.cromwell/nginx \
    && mkdir -p /run/nginx \
    && npm i @cromwell/cms \
    @cromwell/theme-store \
    @cromwell/theme-blog \
    @cromwell/plugin-main-menu \
    @cromwell/plugin-newsletter \
    @cromwell/plugin-product-filter \
    @cromwell/plugin-product-showcase \
    && npx crw s --sv r --try \
    && npx crw s --sv a --try

VOLUME ["/public", "/.cromwell/nginx", "/.cromwell/server", "/.cromwell/logs"]
EXPOSE 80
CMD ["node", "entrypoint.js"]