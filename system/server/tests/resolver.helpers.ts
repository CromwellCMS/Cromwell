import { closeConnection, connectDatabase } from '@App/helpers/connectDataBase';
import { getResolvers } from '@App/helpers/getResolvers';
import { graphQlAuthChecker } from '@cromwell/core-backend';
import { getStoreItem, setStoreItem } from '@cromwell/core';
import { ApolloServer } from 'apollo-server';
import { ApolloServerTestClient, createTestClient } from 'apollo-server-testing';
import { buildSchema } from 'type-graphql';

import { mockWorkingDirectory } from './helpers';

export const setupResolver = async (name: string): Promise<[ApolloServer, ApolloServerTestClient]> => {
    await mockWorkingDirectory(name);
    await connectDatabase();

    let cmsSettings = getStoreItem('cmsSettings');
    if (!cmsSettings) cmsSettings = {};
    cmsSettings.installed = false;
    setStoreItem('cmsSettings', cmsSettings);

    const schema = await buildSchema({
        resolvers: [...(await getResolvers())] as any,
        validate: false,
        authChecker: graphQlAuthChecker,
    });

    const server = new ApolloServer({
        schema,
        playground: true,
    });

    return [server, createTestClient(server)];
}

export const tearDownResolver = async (server: ApolloServer) => {
    await server.stop()
    await closeConnection();
    await new Promise(done => setTimeout(done, 100));
}
