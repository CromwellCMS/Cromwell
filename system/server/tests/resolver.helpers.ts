import { closeConnection, connectDatabase } from '@App/helpers/connectDataBase';
import { getResolvers } from '@App/helpers/getResolvers';
import { ApolloServer } from 'apollo-server';
import { ApolloServerTestClient, createTestClient } from 'apollo-server-testing';
import { buildSchema } from 'type-graphql';

import { mockWorkingDirectory } from './helpers';

export const setupResolver = async (name: string): Promise<[ApolloServer, ApolloServerTestClient]> => {
    const testDir = await mockWorkingDirectory(name);
    await connectDatabase();

    const schema = await buildSchema({
        //@ts-ignore
        resolvers: [...getResolvers()],
        validate: false,
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