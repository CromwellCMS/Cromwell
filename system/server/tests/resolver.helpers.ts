import { closeConnection, connectDatabase } from '@App/helpers/connectDataBase';
import { getResolvers } from '@App/helpers/getResolvers';
import { getStoreItem, setStoreItem } from '@cromwell/core';
import { TGraphQLContext } from '@cromwell/core-backend';
import { ApolloServer } from 'apollo-server';
import fs from 'fs-extra';
import { resolve } from 'path';
import { buildSchema } from 'type-graphql';

import { mockWorkingDirectory } from './helpers';

export const setupResolver = async (name: string): Promise<ApolloServer> => {
    const testDir = await mockWorkingDirectory(name);

    await fs.outputJSON(resolve(testDir, 'package.json'), {
        "name": "@cromwell/test",
        "version": "1.0.0",
        "cromwell": {
            "themes": [
                "@cromwell/theme-store",
                "@cromwell/theme-blog"
            ]
        },
    });

    await connectDatabase({ synchronize: true, migrationsRun: false }, true);

    let cmsSettings = getStoreItem('cmsSettings');
    if (!cmsSettings) cmsSettings = {};
    cmsSettings.installed = false;
    setStoreItem('cmsSettings', cmsSettings);

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
