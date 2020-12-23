import 'reflect-metadata';

import { apiV1BaseRoute, currentApiVersion, serviceLocator, setStoreItem } from '@cromwell/core';
import { readCMSConfigSync, serverMessages } from '@cromwell/core-backend';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cors from 'cors';
import yargs from 'yargs-parser';

import { projectRootDir } from './constants';
import { connectDataBase } from './helpers/connectDataBase';
import { rebuildPage } from './helpers/PageBuilder';
import { AppModule } from './modules/app.module';


async function bootstrap(): Promise<void> {

    setStoreItem('rebuildPage', rebuildPage);
    const args = yargs(process.argv.slice(2));

    const env: 'dev' | 'prod' = args.env ?? 'prod';
    const logLevel = args.logLevel ?? 'errors-only';

    setStoreItem('environment', {
        mode: env,
        logLevel
    });

    const config = readCMSConfigSync(projectRootDir)

    if (!config || !config.apiPort || !config.themeName) throw new Error('renderer::server cannot read CMS config ' + JSON.stringify(config));


    // Connect to DB via TypeOrm
    await connectDataBase(env)


    // Launch REST API server via Nest.js

    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
    app.use(cors({
        origin: [serviceLocator.getFrontendUrl(), serviceLocator.getAdminPanelUrl()]
    }));

    // Setup SwaggerUI
    const options = new DocumentBuilder()
        .setTitle('Cromwell Server API')
        .setVersion(currentApiVersion)
        .setBasePath(`${serviceLocator.getApiUrl()}/${apiV1BaseRoute}/`)
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(`/${apiV1BaseRoute}/api-docs`, app, document);


    await app.listen(config?.apiPort);
    console.log(`Application is running on: ${await app.getUrl()}`);

}

(async () => {
    try {
        await bootstrap();
    } catch (e) {
        console.log(e);
        if (process.send) process.send(serverMessages.onStartErrorMessage);
    }
})();