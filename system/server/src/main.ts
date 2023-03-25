import '@cromwell/server/src/helpers/patches';
import 'reflect-metadata';

import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { fastifyApolloDrainPlugin, fastifyApolloHandler } from '@as-integrations/fastify';
import {
  collectPlugins,
  getAuthSettings,
  getLogger,
  graphQlAuthChecker,
  readCMSConfigSync,
  serverMessages,
  TGraphQLContext,
  TRequestWithUser,
} from '@cromwell/core-backend';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import Fastify from 'fastify';
import getPort from 'get-port';
import { buildSchema } from 'type-graphql';

import { getErrorFormatter } from './filters/apollo-exception.filter';
import { RestExceptionFilter } from './filters/rest-exception.filter';
import { connectDatabase } from './helpers/connect-database';
import { corsHandler } from './helpers/cors-handler';
import { getResolvers } from './helpers/get-resolvers';
import { childRegister } from './helpers/server-manager';
import { checkCmsVersion, checkConfigs, loadEnv } from './helpers/settings';
import { AppModule } from './modules/app.module';
import { authServiceInst } from './services/auth.service';

const logger = getLogger();

async function bootstrap(): Promise<void> {
  readCMSConfigSync();
  await checkConfigs();

  // Connect to DB via TypeOrm
  await connectDatabase();
  checkCmsVersion();

  const envMode = loadEnv();
  const authSettings = await getAuthSettings();

  // Init Fastify as Nest.js server
  const apiPrefix = 'api';
  const fastifyInstance = Fastify();

  // GraphQL
  const schema = await buildSchema({
    resolvers: await getResolvers(),
    orphanedTypes: (await collectPlugins()).entities as any,
    validate: false,
    dateScalarMode: 'isoDate',
    authChecker: graphQlAuthChecker,
  });

  const apolloServer = new ApolloServer({
    schema,
    introspection: envMode.envMode === 'dev',
    formatError: getErrorFormatter(envMode),
    plugins: [
      fastifyApolloDrainPlugin(fastifyInstance),
      envMode.envMode === 'dev'
        ? ApolloServerPluginLandingPageLocalDefault({ footer: false })
        : ApolloServerPluginLandingPageDisabled(),
    ],
  });

  await apolloServer.start();

  await fastifyInstance.route({
    url: `/${apiPrefix}/graphql`,
    method: ['POST', 'OPTIONS'],
    handler: fastifyApolloHandler(apolloServer, {
      context: async (request): Promise<TGraphQLContext> => {
        return { user: (request as TRequestWithUser)?.user };
      },
    }) as any,
  });

  // JWT Auth
  fastifyInstance.addHook('preHandler', async (request: any, reply) => {
    await authServiceInst?.processRequest(request, reply);
  });

  // REST API
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(fastifyInstance as any));

  app.setGlobalPrefix(apiPrefix);
  app.useGlobalFilters(new RestExceptionFilter());

  // Plugins, extensions, etc.
  fastifyInstance.register(require('@fastify/cookie'), {
    secret: authSettings.cookieSecret,
  });
  app.register(require('@fastify/cors'), corsHandler);

  if (envMode.envMode !== 'dev') {
    app.register(require('@fastify/helmet'));
    app.register(require('@fastify/csrf'));
  }

  app.register(require('@fastify/multipart'));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Setup SwaggerUI
  if (envMode.envMode === 'dev') {
    const options = new DocumentBuilder().setTitle('Cromwell API Server').setVersion('1.0.0').addBearerAuth().build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(`/${apiPrefix}/api-docs`, app, document);
  }

  const port = parseInt(
    (
      (await getPort({
        port: getPort.makeRange(4032, 4063),
      })) + ''
    ).replace(/[^0-9]/g, ''),
  );

  await app.listen(port && !isNaN(port) ? port : 4032, '::');
  logger.info(`API Server is running on: ${await app.getUrl()}`);
  childRegister(port);
}

(async () => {
  try {
    await bootstrap();
  } catch (e: any) {
    logger.error('Server: error on launch:', e.stack);
    if (process.send)
      process.send(
        JSON.stringify({
          message: serverMessages.onStartErrorMessage,
        }),
      );
  }
})();
