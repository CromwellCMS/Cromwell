import { TGraphQLContext } from '@cromwell/core-backend';
import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';

// import { closeConnection } from '../src/helpers/connect-database';
import { getResolvers } from '../src/helpers/get-resolvers';
import { setupConnection } from './helpers';

export const setupResolver = async (name: string): Promise<ApolloServer> => {
    await setupConnection(name);

    const schema = await buildSchema({
        resolvers: [...(await getResolvers())] as any,
        validate: false,
        authChecker: () => true,
    });

    const apolloServer = new ApolloServer({
        schema,
        context: (): TGraphQLContext => {
            return {
                user: {
                    id: 1,
                    email: 'test@test.org',
                    roles: [{ name: 'administrator', permissions: ['all'], id: 1 }],
                }
            }
        }
    });

    return apolloServer;
}

export const tearDownResolver = async (server: ApolloServer) => {
    // await server.stop()
    // await closeConnection();
    // await new Promise(done => setTimeout(done, 100));
    return server;
}
