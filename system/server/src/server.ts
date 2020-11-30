import 'reflect-metadata';

import { apiV1BaseRoute, TCmsConfig, setStoreItem, currentApiVersion, serviceLocator } from '@cromwell/core';
import { Product, ProductCategory, Post, Author, Attribute, ProductReview, readCMSConfigSync, serverMessages } from '@cromwell/core-backend';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import fs from 'fs-extra';
import { resolve } from 'path';
import { buildSchema } from 'type-graphql';
import { createConnection, ConnectionOptions } from 'typeorm';
import bodyParser from 'body-parser';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { getThemeController } from './controllers/themeController';
import { getPluginsController } from './controllers/pluginsController';
import { getCmsController } from './controllers/cmsController';
import { getMockController } from './controllers/mockController';
import { rebuildPage } from './helpers/PageBuilder';
import { collectPlugins } from './helpers/collectPlugins';
import { AuthorResolver } from './resolvers/AuthorResolver';
import { PostResolver } from './resolvers/PostResolver';
import { ProductCategoryResolver } from './resolvers/ProductCategoryResolver';
import { ProductResolver } from './resolvers/ProductResolver';
import { AttributeResolver } from './resolvers/AttributeResolver';
import { ProductReviewResolver } from './resolvers/ProductReviewResolver';
import { projectRootDir } from './constants';

setStoreItem('rebuildPage', rebuildPage);

const env: 'dev' | 'prod' | undefined = process.env.ENV ? process.env.ENV as any : 'prod';
setStoreItem('environment', {
    mode: env
});

const config = readCMSConfigSync(projectRootDir)

async function apiServer(): Promise<void> {

    if (!config || !config.apiPort || !config.themeName) throw new Error('renderer::server cannot read CMS config ' + JSON.stringify(config));

    let connectionOptions: ConnectionOptions | undefined = undefined;
    // if (env === 'dev') {
    connectionOptions = require('../ormconfig.dev.json');
    // }
    if (!connectionOptions || !connectionOptions.type) throw new Error('server.ts: Cannot read connection options');
    setStoreItem('dbType', connectionOptions.type);

    const pluginsExports = collectPlugins(projectRootDir);
    (connectionOptions.entities as any) = [
        Product, ProductCategory, Post, Author, Attribute, ProductReview,
        ...pluginsExports.entities
    ];
    if (typeof connectionOptions.database === 'string') {
        (connectionOptions.database as any) = resolve(__dirname, '../', connectionOptions.database);
        console.log('connectionOptions.database', connectionOptions.database);
    }

    if (connectionOptions) createConnection(connectionOptions);
    const schema = await buildSchema({
        resolvers: [
            AttributeResolver,
            AuthorResolver,
            PostResolver,
            ProductCategoryResolver,
            ProductResolver,
            ProductReviewResolver,
            ...pluginsExports.resolvers
        ],
        dateScalarMode: "isoDate",
        validate: false
    });
    const server = new ApolloServer({ schema });

    const app = express();
    server.applyMiddleware({ app, path: `/${apiV1BaseRoute}/graphql` });

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cors({
        origin: [serviceLocator.getFrontendUrl(), serviceLocator.getAdminPanelUrl()]
    }));

    const swaggerOptions = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Cromwell Server API',
                version: currentApiVersion,
            },
        },
        apis: env === 'prod' ? [resolve(__dirname, 'server.js')] : ['**/*.ts']
    };
    const swaggerSpec = swaggerJSDoc(swaggerOptions);
    swaggerSpec.servers = [
        {
            url: `${serviceLocator.getApiUrl()}/${apiV1BaseRoute}/`,
            description: 'API v1 server'
        }
    ]
    app.use(`/${apiV1BaseRoute}/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    await new Promise(resolve => {
        setTimeout(() => {
            app.use(`/${apiV1BaseRoute}/cms`, getCmsController());
            app.use(`/${apiV1BaseRoute}/theme`, getThemeController());
            app.use(`/${apiV1BaseRoute}/plugin`, getPluginsController());
            // app.use(`/${apiV1BaseRoute}/manager`, getManagerController());
            app.use(`/${apiV1BaseRoute}/mock`, getMockController());

            const managerUrl = `${serviceLocator.getManagerUrl()}/${apiV1BaseRoute}`;
            const managerBasePath = `/${apiV1BaseRoute}/manager`;
            app.use(managerBasePath, createProxyMiddleware({
                target: managerUrl, changeOrigin: true, pathRewrite: {
                    [`^${managerBasePath}`]: ''
                }
            }));
            const wsProxy = createProxyMiddleware(serviceLocator.getManagerWsUrl());
            app.use(wsProxy);

            const server = app.listen(config?.apiPort, () => {
                console.log(`API server has started at ${serviceLocator.getApiUrl()}/${apiV1BaseRoute}/`);
                if (process.send) process.send(serverMessages.onStartMessage);
            });

            //// Manager websocket log proxy: 
            const managerWSRoute = `/${apiV1BaseRoute}/manager/log`;
            if (wsProxy.upgrade) server.on('upgrade', (request, socket, head) => {
                const pathname = request?.url;
                console.log('pathname', pathname);
                if (pathname === managerWSRoute) {
                    if (wsProxy.upgrade) wsProxy.upgrade(request, socket, head);
                } else {
                    socket.destroy();
                }
            });
            //// 

            resolve();
        }, 100)
    })
}

(async () => {
    try {
        await apiServer();
    } catch (e) {
        console.log(e);
        if (process.send) process.send(serverMessages.onStartErrorMessage);
    }
})();


// Proxy routes of Manager for Server's swagger

/**
  * @swagger
  *
  * /manager/services/change-theme/{themeName}:
  *   get:
  *     description: Proxy route. More info in http://localhost:4016/api/v1/api-docs/#/Services/get_services_change_theme__themeName_
  *     tags:
  *       - Manager
  *     produces:
  *       - application/json
  *     parameters:
  *       - name: themeName
  *         description: Name of a new theme to change
  *         in: path
  *         required: true
  *         type: string
  *     responses:
  *       200:
  *         description: true
  */


/**
 * @swagger
 *
 * /manager/services/rebuild-theme:
 *   get:
 *     description: Proxy route. More info in http://localhost:4016/api/v1/api-docs/#/Services/get_services_rebuild_theme
 *     tags:
 *       - Services
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: true
 */
