require('dotenv').config();
import 'reflect-metadata';

import { apiV1BaseRoute, currentApiVersion } from '@cromwell/core';
import { readCMSConfigSync, serverMessages } from '@cromwell/core-backend';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { connectDatabase } from './helpers/connectDataBase';
import { setEnv } from './helpers/setEnv';
import { AppModule } from './modules/app.module';


async function bootstrap(): Promise<void> {
    const envMode = setEnv();

    const config = readCMSConfigSync();
    if (!config || !config.apiPort) throw new Error('Failed to read CMS config ' + JSON.stringify(config));

    // Connect to DB via TypeOrm
    await connectDatabase();


    // Launch REST API server via Nest.js

    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
    app.setGlobalPrefix(apiV1BaseRoute);

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
    SwaggerModule.setup(`/${apiV1BaseRoute}/api-docs`, app, document);


    await app.listen(config.apiPort ?? 4032, '::');
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