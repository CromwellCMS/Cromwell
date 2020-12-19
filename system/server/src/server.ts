import 'reflect-metadata';

import { apiV1BaseRoute, currentApiVersion, serviceLocator, setStoreItem, logLevelMoreThan } from '@cromwell/core';
import {
    Attribute,
    Author,
    InputPluginEntity,
    InputThemeEntity,
    PluginEntity,
    Post,
    Product,
    ProductCategory,
    ProductReview,
    readCMSConfigSync,
    serverMessages,
    ThemeEntity,
} from '@cromwell/core-backend';
import { ApolloServer } from 'apollo-server-express';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { resolve } from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { buildSchema } from 'type-graphql';
import { ConnectionOptions, createConnection } from 'typeorm';
import yargs from 'yargs-parser';

import { projectRootDir } from './constants';
import { getCmsController } from './controllers/cmsController';
import { getMockController } from './controllers/mockController';
import { getPluginsController } from './controllers/pluginsController';
import { getThemeController } from './controllers/themeController';
import { collectPlugins } from './helpers/collectPlugins';
import { GenericTheme, GenericPlugin } from './helpers/genericEntities';
import { rebuildPage } from './helpers/PageBuilder';
import { AttributeResolver } from './resolvers/AttributeResolver';
import { AuthorResolver } from './resolvers/AuthorResolver';
import { PostResolver } from './resolvers/PostResolver';
import { ProductCategoryResolver } from './resolvers/ProductCategoryResolver';
import { ProductResolver } from './resolvers/ProductResolver';
import { ProductReviewResolver } from './resolvers/ProductReviewResolver';

setStoreItem('rebuildPage', rebuildPage);
const args = yargs(process.argv.slice(2));

const env: 'dev' | 'prod' = args.env ?? 'prod';
const logLevel = args.logLevel ?? 'errors-only';

setStoreItem('environment', {
    mode: env,
    logLevel
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
        Product, ProductCategory, Post, Author, Attribute, ProductReview, ThemeEntity, PluginEntity,
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
            GenericPlugin.resolver,
            GenericTheme.resolver,
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

    await new Promise(done => {
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

            done(true);
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
 *       - Manager
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: true
 */
