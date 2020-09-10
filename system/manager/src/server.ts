import { apiV1BaseRoute, TCmsConfig, setStoreItem, currentApiVersion, serviceLocator } from '@cromwell/core';
import { readCMSConfig } from '@cromwell/core-backend';
import express from 'express';
import { resolve } from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import config from './config';
import { getServiceController } from './controllers/serviceController';

export const startManagerServer = () => {
    const { projectRootDir, localProjectDir } = config;

    const cmsconfig = readCMSConfig(projectRootDir)

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


    app.listen(cmsconfig.managerPort, () => {
        console.log(`Manager server has started at ${serviceLocator.getManagerUrl()}/${apiV1BaseRoute}/`);
        if (process.send) process.send('ready');
    });
}
