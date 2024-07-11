# CMS Core Development

### Prerequisites

- Node.js v12-16
- Python
- `npm install node-gyp -g`

### Install

```sh
$ git clone https://github.com/CromwellCMS/Cromwell
$ npm run build
$ yarn cromwell start
```

**You don't need to run `npm install`**, installation/build handled by startup.js script in the root which invoked by `npm run build`. In development use yarn to install/update dependencies.

### Configure

By default the CMS will launch with SQLite database.  
But you may need to use some specific development databases. Copy config file in the root from `cmsconfig.json.example` to `cmsconfig.json`. Rename property of needed DB to `orm` for the CMS to use it. For example `orm-mariadb` to `orm`.

Launch development databases:

- `npm run docker:start-dev-mariadb` for MariaDB
- `docker:start-dev-postgres` for Postgres

## Services

In runtime Cromwell CMS is a set of services (npm packages).  
Below listed core services with default settings (ports at localhost address can be configured in cmsconfig.json):

### 1. API Server and Proxy

- Path - system/server
- NPM Module - @cromwell/server
- Run command - `yarn crw s --sv s`
- Available at - http://localhost:4016

API server and Proxy. That's two servers in one service.  
Proxy server handles all incoming requests and distributes them for other services. So all services of CMS will be available at http://localhost:4016 in development. In production it's recommended to setup Nginx config to proxy services instead. CMS goes with configured Nginx config for this purpose.
Proxy manages API Server, that's how [`safe reloads`](https://cromwellcms.com/docs/development/plugin-development#how-exported-extensions-will-be-applied-in-the-production-server) are working.

API Server Implements REST API for transactions or internal usage and GraphQL API for data flow. Uses Fastify and Nest.js

- Swagger - http://localhost:4016/api/api-docs/
- GraphQL endpoint at: http://localhost:4016/api/graphql. [Playground / Schema docs](https://studio.apollographql.com/sandbox/explorer?endpoint=http%3A%2F%2Flocalhost%3A4016%2Fapi%2Fgraphql)

### 2. Renderer

- Path - system/renderer
- NPM Module - @cromwell/renderer
- Run command - `yarn crw s --sv r`
- Available at - http://localhost:4128

Next.js service, compiles (using Utils) and serves files of an active Theme and Plugins to end-users.

### 3. Admin Panel

- Path - system/admin
- NPM Module - @cromwell/admin-panel
- Run command - `yarn crw s --sv a`
- Available at - http://localhost:4064

Uses dedicated Fastify server to serve Admin Panel files and public media files.

### 4. Utils

- Path - system/utils
- NPM Module - @cromwell/utils

Modules bundler / compiler / package manager

> https://github.com/CromwellCMS/Cromwell/tree/master/system/utils#readme

### 5. Manager

- Path - system/manager
- NPM Module - @cromwell/cms

Cromwell CMS main module. Starts and controls other services

### 6. CLI

- Path - system/cli
- NPM Module - @cromwell/cli

Provides "cromwell" CLI.

## Develop services

After cloning and building the repo you can start services in development mode (with watchers) by adding --dev flag:  
`yarn crw s --sv s --dev` - Will start API Server service with Nodemon and Rollup watching code changes.  
`yarn crw s --sv a --dev` - Start Admin panel service with Webpack watcher and hot reloading.

For other services you can run scripts from their location:  
`cd system/core/common && npm run watch` - Will launch watcher on `@cromwell/core` package.

Same for Theme development:
`cd themes/store && npm run watch`
