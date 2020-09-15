import { apiV1BaseRoute, TCmsConfig, setStoreItem, currentApiVersion, serviceLocator } from '@cromwell/core';
import { readCMSConfigSync } from '@cromwell/core-backend';
import express from 'express';
import { resolve } from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import config from './config';
import { getServiceController } from './controllers/serviceController';
import { getRendererController } from './controllers/rendererController';
import WebSocket from 'ws';
import { ManagerState } from './managerState';

export const startManagerServer = () => {
    const { projectRootDir, localProjectDir } = config;

    const cmsconfig = readCMSConfigSync(projectRootDir)

    const app = express();
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cors());

    const swaggerOptions = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Cromwell Manager API',
                version: currentApiVersion,
            },
        },
        apis: [resolve(__dirname, 'manager.js')]
    };
    const swaggerSpec = swaggerJSDoc(swaggerOptions);
    swaggerSpec.servers = [
        {
            url: `${serviceLocator.getManagerUrl()}/${apiV1BaseRoute}/`,
            description: 'API v1 server'
        }
    ]
    app.use(`/${apiV1BaseRoute}/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.use(`/${apiV1BaseRoute}/services`, getServiceController());
    app.use(`/${apiV1BaseRoute}/renderer`, getRendererController());


    const server = app.listen(cmsconfig.managerPort, () => {
        console.log(`Manager server has started at ${serviceLocator.getManagerUrl()}/${apiV1BaseRoute}/`);
        if (process.send) process.send('ready');
    });



    const wss = new WebSocket.Server({ noServer: true });
    wss.on('connection', function connection(ws) {
        ws.on('message', function incoming(message) {
            console.log('received: %s', message);
        });
        ws.send('Manager connected ' + new Date());
        ManagerState.log.renderer.forEach(line => ws.send(line));
        ManagerState.addOnLogListener('renderer', 'WS_Renderer', (line) => {
            ws.send(line);
        })
    });

    const managerWSRoute = `/${apiV1BaseRoute}/manager/log`;

    server.on('upgrade', function upgrade(request, socket, head) {
        const pathname = request?.url;
        console.log('Manager:: pathname', managerWSRoute, pathname)

        if (pathname === managerWSRoute) {
            wss.handleUpgrade(request, socket, head, function done(ws) {
                wss.emit('connection', ws, request);
            });
        } else {
            socket.destroy();
        }
    });
}
