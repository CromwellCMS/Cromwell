import { closeConnection, connectDatabase } from '@App/helpers/connectDataBase';
import { getResolvers } from '@App/helpers/getResolvers';
import { getStoreItem, setStoreItem } from '@cromwell/core';
import { graphQlAuthChecker } from '@cromwell/core-backend';
import { ApolloServer } from 'apollo-server';
import { ApolloServerTestClient, createTestClient } from 'apollo-server-testing';
import fs from 'fs-extra';
import { resolve } from 'path';
import { buildSchema } from 'type-graphql';

import { mockWorkingDirectory } from './helpers';

export const setupResolver = async (name: string): Promise<[ApolloServer, ApolloServerTestClient]> => {
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

    await connectDatabase({ synchronize: true }, true);

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
