import 'reflect-metadata';

import { apiExtensionRoute, apiMainRoute, currentApiVersion } from '@cromwell/core';
import { readCMSConfigSync, serverMessages } from '@cromwell/core-backend';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApolloServer } from 'apollo-server-fastify';
import fastify from 'fastify';
import { buildSchema } from 'type-graphql';

import { graphQlAuthChecker } from './auth/auth.guard';
import { authSettings, TGraphQLContext } from './auth/constants';
import { ExceptionFilter } from './filters/exception.filter';
import { connectDatabase } from './helpers/connectDataBase';
import { corsHandler } from './helpers/corsHandler';
import { getResolvers } from './helpers/getResolvers';
import { loadEnv } from './helpers/loadEnv';
import { AppModule } from './modules/app.module';
import { authServiceInst } from './services/auth.service';

require('dotenv').config();

async function bootstrap(): Promise<void> {
    const envMode = loadEnv();
    const config = readCMSConfigSync();
    if (!config) throw new Error('Failed to read CMS config ' + JSON.stringify(config));

    // Connect to DB via TypeOrm
    await connectDatabase(envMode.serverType);


    // Launch Nest.js with Fastify
    const apiPrefix = envMode.serverType === 'main' ? apiMainRoute : apiExtensionRoute;
    const fastifyInstance = fastify();

    // GraphQL
    const schema = await buildSchema({
        resolvers: getResolvers(envMode.serverType),
        validate: false,
        dateScalarMode: "isoDate",
        authChecker: graphQlAuthChecker,
    })

    const apolloServer = new ApolloServer({
        debug: envMode.envMode === 'dev',
        playground: envMode.envMode === 'dev',
        schema,
        context: (context): TGraphQLContext => {
            return { user: context?.request?.user }
        }
    });

    fastifyInstance.register(apolloServer.createHandler({
        path: `/${apiPrefix}/graphql`,
        cors: corsHandler,
    }));


    // JWT Auth
    fastifyInstance.addHook('preHandler', async (request: any, reply) => {
        await authServiceInst?.processRequest(request, reply);
    });

    // REST API
    const app = await NestFactory.create<NestFastifyApplication>(AppModule,
        new FastifyAdapter(fastifyInstance as any));

    app.setGlobalPrefix(apiPrefix);
    app.useGlobalFilters(new ExceptionFilter());

    // Plugins, extensions, etc.
    fastifyInstance.register(require('fastify-cookie'), {
        secret: authSettings.cookieSecret,
    })
    app.register(require('fastify-cors'), corsHandler);

    if (envMode.envMode !== 'dev') {
        app.register(require('fastify-helmet'));
        app.register(require('fastify-csrf'));
    }

    app.register(require('fastify-multipart'));
    app.useGlobalPipes(new ValidationPipe({ transform: true }));


    // Setup SwaggerUI
    if (envMode.envMode === 'dev') {
        const options = new DocumentBuilder()
            .setTitle('Cromwell Server API')
            .setVersion(currentApiVersion)
            .addBearerAuth()
            .build();
        const document = SwaggerModule.createDocument(app, options);
        SwaggerModule.setup(`/${apiPrefix}/api-docs`, app, document);
    }

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

