import 'reflect-metadata';

import { apiV1BaseRoute, TCmsConfig, setStoreItem, currentApiVersion, serviceLocator } from '@cromwell/core';
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
//@ts-ignore
const { pluginsResolvers } = require('../.cromwell/imports/resolvers.imports.gen');
//@ts-ignore
const { pluginsEntities } = require('../.cromwell/imports/entities.imports.gen');
import { getThemeController } from './controllers/themeController';
import { getPluginsController } from './controllers/pluginsController';
import { getCmsController } from './controllers/cmsController';
import { getMockController } from './controllers/mockController';
import { rebuildPage } from './helpers/PageBuilder';
import { AuthorResolver } from './resolvers/AuthorResolver';
import { PostResolver } from './resolvers/PostResolver';
import { ProductCategoryResolver } from './resolvers/ProductCategoryResolver';
import { ProductResolver } from './resolvers/ProductResolver';
import { AttributeResolver } from './resolvers/AttributeResolver';
import { ProductReviewResolver } from './resolvers/ProductReviewResolver';
import { Product, ProductCategory, Post, Author, Attribute, ProductReview, readCMSConfigSync } from '@cromwell/core-backend';

setStoreItem('rebuildPage', rebuildPage);

const projectRootDir = resolve(__dirname, '../../../');
const env: 'dev' | 'prod' | undefined = process.env.ENV ? process.env.ENV as any : 'prod';
setStoreItem('env', env);

const config = readCMSConfigSync(projectRootDir)

async function apiServer(): Promise<void> {

    if (!config || !config.apiPort || !config.themeName) throw new Error('renderer::server cannot read CMS config ' + JSON.stringify(config));

    let connectionOptions: ConnectionOptions | undefined = undefined;
    // if (env === 'dev') {
    connectionOptions = require('../ormconfig.dev.json');
    // }
    if (!connectionOptions || !connectionOptions.type) throw new Error('server.ts: Cannot read connection options');
    setStoreItem('dbType', connectionOptions.type);

    const _pluginsEntities = (pluginsEntities && Array.isArray(pluginsEntities)) ? pluginsEntities : [];
    (connectionOptions.entities as any) = [
        Product, ProductCategory, Post, Author, Attribute, ProductReview,
        ..._pluginsEntities
    ];
    if (typeof connectionOptions.database === 'string') {
        (connectionOptions.database as any) = resolve(__dirname, '../', connectionOptions.database);
        console.log('connectionOptions.database', connectionOptions.database);
    }

    const _pluginsResolvers = (pluginsResolvers && Array.isArray(pluginsResolvers)) ? pluginsResolvers : [];


    if (connectionOptions) createConnection(connectionOptions);
    const schema = await buildSchema({
        resolvers: [
            AttributeResolver,
            AuthorResolver,
            PostResolver,
            ProductCategoryResolver,
            ProductResolver,
            ProductReviewResolver,
            ..._pluginsResolvers
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
            if (process.send) process.send('ready');
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

    }, 100)
}

// async function adminPanelServer() {
//     const app = express();
//     app.use(express.static(publicDir, {}));
//     app.get('*', (req, res) => {
//         res.sendFile(publicDir + '/index.html');
//     });
//     app.listen(config.adminPanelPort);
//     console.log(`Admin Panel server has started at http://localhost:${config.adminPanelPort}/`);
// }


// Test feature that serves satic pages and other files from .next folder (bad idea)
// Use Nginx to cache response of Next.js server
/*
import { getFrontendBuildDir, getRootBuildDir, getBuildId } from './helpers/getFrontendBuildDir';
const buildStaticDir = getFrontendBuildDir();
const buildId = getBuildId();
const rootBuildDir = getRootBuildDir();
async function frontendServer() {
    if (buildStaticDir && config && config.themePort) {
        const app = express();
        app.get('*', function (req, res) {
            console.log('req.path', req.path);
            const reqPath = decodeURI(req.path);
            let resFilePath;
            if (reqPath.includes('/_next/data/')) {
                resFilePath = `${rootBuildDir}/${reqPath.replace(`/_next/data/${buildId}`, `server/static/${buildId}/pages`)}`;
            } else if (reqPath.includes('/_next/')) {
                resFilePath = `${rootBuildDir}/${reqPath.replace('/_next/', '')}`;
            } else {
                resFilePath = `${buildStaticDir}${reqPath}.html`;
            }
            fs.access(resFilePath, fs.constants.F_OK, (err) => {
                if (!err) {
                    res.sendFile(resFilePath);
                    return;
                } else {
                    console.error('File does not exist: ' + resFilePath);
                    res.status(404).send('Not found');
                }
            });
        });
        app.listen(config.themePort);
        console.log(`Frontend theme server has started at http://localhost:${config.themePort}/`);
    }
}
*/

apiServer();
// adminPanelServer();
// frontendServer();