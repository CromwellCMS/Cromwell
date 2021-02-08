import 'reflect-metadata';

import { apiV1BaseRoute, currentApiVersion } from '@cromwell/core';
import { readCMSConfigSync, serverMessages } from '@cromwell/core-backend';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { connectDatabase } from './helpers/connectDatabase';
import { setEnv } from './helpers/setEnv';
import { AppModule } from './modules/app.module';

async function bootstrap(): Promise<void> {
    const envMode = setEnv();

    const config = readCMSConfigSync()
    if (!config || !config.apiPort) throw new Error('Failed to read CMS config ' + JSON.stringify(config));


    // Connect to DB via TypeOrm
    await connectDatabase(envMode);


    // Launch REST API server via Nest.js

    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
    app.setGlobalPrefix(apiV1BaseRoute);

    app.register(require('fastify-multipart'));

    app.enableCors({
        origin: '*'
    })

    // Setup SwaggerUI
    const options = new DocumentBuilder()
        .setTitle('Cromwell Server API')
        .setVersion(currentApiVersion)
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(`/${apiV1BaseRoute}/api-docs`, app, document);


    await app.listen(config.apiPort ?? 4032);
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