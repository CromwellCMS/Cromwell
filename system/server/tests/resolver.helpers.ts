import { closeConnection, connectDatabase } from '@App/helpers/connectDataBase';
import { getResolvers } from '@App/helpers/getResolvers';
import { graphQlAuthChecker } from '@cromwell/core-backend';
import { ApolloServer } from 'apollo-server';
import { ApolloServerTestClient, createTestClient } from 'apollo-server-testing';
import { buildSchema } from 'type-graphql';

jest.mock('@App/helpers/fireAction', () => {
    return {
        mainFireAction: () => null,
    }
});

import { mockWorkingDirectory } from './helpers';

export const setupResolver = async (name: string): Promise<[ApolloServer, ApolloServerTestClient]> => {
    await mockWorkingDirectory(name);
    await connectDatabase('plugin');

    const schema = await buildSchema({
        resolvers: [...(await getResolvers('main'))] as any,
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
