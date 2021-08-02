import { closeConnection } from '@App/helpers/connectDataBase';
import { getResolvers } from '@App/helpers/getResolvers';
import { TGraphQLContext } from '@cromwell/core-backend';
import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';

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
                    id: 'test',
                    email: 'test@test.org',
                    role: 'administrator',
                }
            }
        }
    });

    return apolloServer;
}

export const tearDownResolver = async (server: ApolloServer) => {
    await server.stop()
    await closeConnection();
    await new Promise(done => setTimeout(done, 100));
}
