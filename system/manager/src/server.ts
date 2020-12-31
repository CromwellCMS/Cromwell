import { apiV1BaseRoute, currentApiVersion, serviceLocator } from '@cromwell/core';
import { readCMSConfigSync } from '@cromwell/core-backend';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { resolve } from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import WebSocket from 'ws';

import config from './config';
import { getRendererController } from './controllers/rendererController';
import { getServiceController } from './controllers/serviceController';
import { ManagerState } from './managerState';

export const startManagerServer = () => {
    const cmsconfig = readCMSConfigSync()

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
        ManagerState.log.base?.forEach(line => ws.send(line));
        ManagerState.addOnLogListener('base', 'WS_base', (line) => {
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
