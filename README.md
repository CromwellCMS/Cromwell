# Cromwell CMS

JavaScipt CMS for Next.js blazing-fast statically pre-rendered React websites with custom easy-to-build Themes and Plugins. 

Includes: 
- Online store and blogging platform management systems.
- User-friendly drag-and-drop website builder.
- Simple installation of Themes and Plugins from official store and their local management.
- Integrated Database. SQLite for development and MySQL/PostgreSQL for production.


## Prerequisites
- Node.js v12 or above

## Installation

All installation handled by startup.js script in the root. Script doesn't require any node_modules to be installed.

```sh
$ npm run startup
```
Cromwell CMS is a multi-package repository managed by Lerna (Cromwella recently), so the script will check and install modules via cromwella cli, compile system and start it.
Also the script can be used on a regular basis to start CMS in production environment.

Don't use "npm install my-package", it will delete all installed node_modules first. Read more about multi-package repositories in [Lerna docs](https://github.com/lerna/lerna)

## Services

Cromwell CMS uses microservice architecture.  
Following core services are available currently with default settings (ports at localhost address can be configured in system/cmsconfig.json):

### 1. Server
> http://localhost:4032

API server. Implements REST API for internal usage and GraphQL API for data flow.
Checks for installed Plugins and rebuilds with them.

- Swagger - http://localhost:4032/api/v1/api-docs/
- GraphQL Playground / Schema: http://localhost:4032/api/v1/graphql

### 2. Renderer 
> http://localhost:4128

Next.js service, compiles and serves files of an active Theme and Plugins to end-users.
Supposed to be started after Server service up and running.

### 3. Admin Panel
> http://localhost:4064

Self-compilable service that checks for installed plugins and rebuilds with them Admin Panel.
Uses dedicated Express.js server to serve Admin Panel files and public media files. 

### 4. Manager
> http://localhost:4016
Internal service for communicating with and managing other services.
Uses dedicated Express.js server for communication with other services:
Swagger - http://localhost:4016/api/v1/api-docs/

### 5. Cromwella
Cromwell CMS package manager with built-in cli
> https://github.com/CromwellCMS/Cromwell/tree/master/system/cromwella#readme
```sh
npx cromwella
```