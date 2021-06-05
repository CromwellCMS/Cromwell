import 'reflect-metadata';
require('dotenv').config();

import { apiV1BaseRoute, currentApiVersion } from '@cromwell/core';
import { getLogger, graphQlAuthChecker, readCMSConfigSync, serverMessages, TGraphQLContext } from '@cromwell/core-backend';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApolloServer } from 'apollo-server-fastify';
import fastify from 'fastify';
import getPort from 'get-port';
import { buildSchema } from 'type-graphql';

import { authSettings } from './auth/constants';
import { ExceptionFilter } from './filters/exception.filter';
import { collectPlugins } from './helpers/collectPlugins';
import { connectDatabase } from './helpers/connectDataBase';
import { corsHandler } from './helpers/corsHandler';
import { getResolvers } from './helpers/getResolvers';
import { checkCmsVersion, checkConfigs, loadEnv } from './helpers/loadEnv';
import { childRegister } from './helpers/serverManager';
import { AppModule } from './modules/app.module';
import { authServiceInst } from './services/auth.service';

const logger = getLogger();

async function bootstrap(): Promise<void> {
    loadEnv();
    readCMSConfigSync();
    await checkConfigs();

    // Connect to DB via TypeOrm
    await connectDatabase();
    await checkCmsVersion();

    const envMode = loadEnv();

    // Launch Nest.js with Fastify
    const apiPrefix = apiV1BaseRoute;
    const fastifyInstance = fastify();

    // GraphQL
    const schema = await buildSchema({
        resolvers: (await getResolvers()),
        orphanedTypes: (await collectPlugins()).entities as any,
        validate: false,
        dateScalarMode: "isoDate",
        authChecker: graphQlAuthChecker,
    });

    const apolloServer = new ApolloServer({
        debug: envMode.envMode === 'dev',
        playground: envMode.envMode === 'dev',
        schema,
        context: (context): TGraphQLContext => {
            return { user: context?.request?.user }
        }
    });
    // await apolloServer.start();

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
            .setTitle('Cromwell API Server')
            .setVersion(currentApiVersion)
            .addBearerAuth()
            .build();
        const document = SwaggerModule.createDocument(app, options);
        SwaggerModule.setup(`/${apiPrefix}/api-docs`, app, document);
    }

    const port = await getPort({ port: getPort.makeRange(4032, 4063) });
    await app.listen(port, '::');
    logger.info(`API Server is running on: ${await app.getUrl()}`);
    childRegister(port);

}

(async () => {
    try {
        await bootstrap();
    } catch (e) {
        logger.error('Server: error on launch:', e);
        if (process.send) process.send(JSON.stringify({
            message: serverMessages.onStartErrorMessage,
        }));
    }
})();

