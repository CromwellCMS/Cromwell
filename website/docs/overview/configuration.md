---
sidebar_position: 3
---

# Configuration

Initial Cromwell CMS configuration stored in `cmsconfig.json` in a root of a project.

### Node.js

For example, if you want to connect CMS to your own database, create cmsconfig.json in your project directory root with the following content:

```json title="cmsconfig.json"
{
  "orm": {
    "type": "mariadb",
    "host": "localhost",
    "port": 3306,
    "username": "root",
    "database": "cromwell",
    "password": "your-password"
  }
}
```

The config will be loaded on CMS start with `npx cromwell start`

### Docker

For a Docker container the config will be a bit different since "localhost" inside a container resolves into container's IP address, not host address. If your database runs in another service of docker-compose under name "db" then use it as "host":

```json title="cmsconfig.json"
{
  "orm": {
    "type": "mariadb",
    "host": "db",
    "port": 3306,
    "username": "root",
    "database": "cromwell",
    "password": "your-password"
  }
}
```

To load the config into a container we need to change docker-compose.yml.  
Remove all DB\_\* environment variables and add the volume:

```diff title="diff: docker-compose.yml"
  cromwell:
    image: cromwell:latest
    container_name: cromwell_container
    depends_on:
      - db
    volumes:
+      - ./cmsconfig.json:/app/cmsconfig.json:ro
       - ./nginx:/app/nginx
       - ./public:/app/public
       - ./.cromwell/server:/app/.cromwell/server
       - ./.cromwell/logs:/app/.cromwell/logs
     ports:
       - 80:80
     restart: unless-stopped
-    environment:
-      DB_TYPE: mariadb
-      DB_HOST: db
-      DB_PORT: 3306
-      DB_DATABASE: cromwell
-      DB_USER: cromwell
-      DB_PASSWORD: my_password
```

## Config options

Options of `cmsconfig.json`. Format: **optionName** `: type` (`defaultValue`) - description.

- **orm:** `: ConnectionOptions` - Options passed to TypeORM to create a new connection. [See in TypeORM docs](https://typeorm.io/#/connection-options).
- **apiUrl** `: string` (`http://localhost:4016`) - Location of API server. Used in development if, for example, you open frontend at `http://localhost:4128`, it will make request to API URL (in production if you open it at any domain or 127.0.0.1, frontend will make requests to /api route of current origin).  
  In production it used by Next.js service to make API requests at server-side render. So it's normal to have `localhost` here in production usage. If you host multiple instances and use load balancing, then place here URL to your proxy balancer.
- **adminUrl** `: string` (`http://localhost:4064`) - URL of admin panel server.
- **frontendUrl** `: string` (`http://localhost:4128`) - URL for Next.js server, same as apiUrl, used
- **env** `: string` (`prod`) - CMS environment. Available values: `dev`, `prod`. 'dev' environment adds:
  - Detailed logs;
  - Swagger UI at http://localhost:4016/api/v1/api-docs/;
  - "synchronize": true by default for SQLite in ConnectionOptions. Can be overwritten in `orm` property;
  - /api/v1/mock REST API routes for mocking data in Swagger UI.
- **accessTokenSecret** `: string` - Authentication in Cromwell CMS works via access/refresh JSON Web Token (JWT) method. You can manually provide a secret that will be used to sign tokens, otherwise the CMS will generate a random secret.
- **refreshTokenSecret** `: string` - Same as accessTokenSecret, but for refresh JWT.
- **accessTokenExpirationTime** `: number` (`600`) - Time in seconds after which access token will be considered as expired.
- **refreshTokenExpirationTime** `: number` (`1296000`) - Same as accessTokenExpirationTime, but for refresh JWT.
- **serviceSecret** `: string` - Secret key used for interservice communications. Basically can be any string. Usually it generated automatically, but if for example, you host Next.js server on one dedicated server and API server on another, you must set manually the same serviceSecret key on both machines, otherwise requests from Next.js server will be unauthorized and rejected.
- **monolith** `: boolean` - Enable monolithic mode. Next.js server will be connected to the database.
- **defaultSettings** `: Object` - Default values used to initialize database settings of the CMS on first launch.
  - **installed** `: boolean` (`false`) - If false, open installation window on admin panel visit until installation finished. Important to note that when there's "installed: false" in DB, all routes will be unprotected by authorization, which means anyone can open admin panel, configure new admin account or make any changes on other pages.
  - **themeName** `: string` (`@cromwell/theme-store`) - NPM package name of an initial theme to use.
  - **logo** `: string` (`/themes/@cromwell/theme-store/shopping-cart.png`) - Path to web site logo in [public](/docs/overview/installation#working-directories) directory
  - **defaultPageSize** `: number` (`15`) - Page size to use by default in categories.
  - **defaultShippingPrice** `: number` - Shipping price to use in standard shipping/delivery method. For now there's only this one method, but you will be able to add more in one of future updates.
  - **currencies** `: Object[]` - Array of available currencies to use in the store. Currency object has following properties:
    - **id** `: string` - Unique id.
    - **tag** `: string` - Currency code such as "USD".
    - **symbol** `: string` - Symbol, "$".
    - **ratio** `: number` - Ratio between currencies that used to convert prices when a user switches active currency. If, for example, you set "USD" as 1, then "EUR" will have 0.8 value. It also can be as 10 and 8, since CMS only use proportions between numbers, so numbers themselves can have any value.
      For now Cromwell CMS doesn't update currencies automatically, so you have to update them in the admin panel.

Note that this config is supposed to change general system setting and that cannot be changed at run-time. After edits you need to restart CMS.

Web-site personalization settings are stored in database and changed in the admin panel at Settings page.
