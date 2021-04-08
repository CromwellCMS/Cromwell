import 'reflect-metadata';

import { apiExtensionRoute, apiMainRoute, currentApiVersion } from '@cromwell/core';
import { readCMSConfigSync, serverMessages } from '@cromwell/core-backend';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { connectDatabase } from './helpers/connectDataBase';
import { loadEnv } from './helpers/loadEnv';
import { AppModule } from './modules/app.module';

require('dotenv').config();

async function bootstrap(): Promise<void> {
    const envMode = loadEnv();
    const config = readCMSConfigSync();
    if (!config) throw new Error('Failed to read CMS config ' + JSON.stringify(config));

    // Connect to DB via TypeOrm
    await connectDatabase();


    // Launch REST API server via Nest.js
    const apiPrefix = envMode.serverType === 'main' ? apiMainRoute : apiExtensionRoute;

    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
    app.setGlobalPrefix(apiPrefix);

    app.register(require('fastify-cookie'), {
        // secret: "my-secret",
    })
    app.register(require('fastify-cors'), {
        origin: function (origin, callback) {
            if (typeof origin === 'undefined') {
                // Requests from other services via node-fetch produce undefined value in origin
                // Let it pass for now. @TODO: fix undefined 
                return callback(null, true);
            }

            if (/localhost/.test(origin))
                return callback(null, true);

            callback(new Error("Not allowed"));
        },
        credentials: true,
    })

    app.register(require('fastify-multipart'));
    app.useGlobalPipes(new ValidationPipe({ transform: true }));


    // Setup SwaggerUI
    const options = new DocumentBuilder()
        .setTitle('Cromwell Server API')
        .setVersion(currentApiVersion)
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(`/${apiPrefix}/api-docs`, app, document);

    const port = envMode.serverType === 'main' ? (config.mainApiPort ?? 4016) : (config.pluginApiPort ?? 4032)
    await app.listen(port, '::');
    console.log(`Application is running on: ${await app.getUrl()}`);

    if (process.send) process.send(serverMessages.onStartMessage);
}

(async () => {
    try {
        await bootstrap();
    } catch (e) {
        console.log(e);
        if (process.send) process.send(serverMessages.onStartErrorMessage);
    }
})();