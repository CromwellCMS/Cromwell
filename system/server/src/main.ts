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
import { checkRoles } from '@cromwell/core-backend/dist/helpers/auth-roles-permissions';
import { reportProcessPid } from '@cromwell/core-backend/dist/helpers/shell';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import Fastify from 'fastify';
import multer from 'fastify-multer';
import getPort from 'get-port';
import { buildSchema } from 'type-graphql';
import Container from 'typedi';

import { getErrorFormatter } from './filters/apollo-exception.filter';
import { RestExceptionFilter } from './filters/rest-exception.filter';
import { connectDatabase } from './helpers/connect-database';
import { corsHandler } from './helpers/cors-handler';
import { getResolvers } from './helpers/get-resolvers';
import { childRegister } from './helpers/server-manager';
import { checkCmsVersion, checkConfigs, loadEnv } from './helpers/settings';
import { AppModule } from './modules/app.module';
import { AuthService } from './services/auth.service';

// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
    // introspection: envMode.envMode === 'dev',
    introspection: true,
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
    await Container.get(AuthService).processRequest(request, reply);
  });

  // REST API
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(fastifyInstance as any), {
    logger: false,
  });

  app.setGlobalPrefix(apiPrefix);
  app.useGlobalFilters(new RestExceptionFilter());

  // Plugins, extensions, etc.
  fastifyInstance.register(require('@fastify/cookie'), {
    secret: authSettings.cookieSecret,
  });
  app.register(require('@fastify/cors'), corsHandler);

  if (envMode.envMode !== 'dev') {
    app.register(require('@fastify/helmet'));
  }

  app.register(multer.contentParser);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Swagger is broken, error comes from inside the package. TODO: investigate
  // // Setup SwaggerUI
  // if (envMode.envMode === 'dev') {
  //   const options = new DocumentBuilder().setTitle('Cromwell API Server').setVersion('1.0.0').addBearerAuth().build();
  //   const document = SwaggerModule.createDocument(app, options);
  //   SwaggerModule.setup(`/${apiPrefix}/api-docs`, app, document);
  // }

  const port = parseInt(
    (
      (await getPort({
        port: getPort.makeRange(4032, 4063),
      })) + ''
    ).replace(/[^0-9]/g, ''),
  );

  await checkRoles();

  await app.listen(port && !isNaN(port) ? port : 4032, '::');
  logger.info(`API Server is running on: ${await app.getUrl()}`);
  childRegister(port);
}

process.on('uncaughtException', (err) => {
  logger.error('An unhandled error occurred: ', err);
});

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

reportProcessPid('server_main');
