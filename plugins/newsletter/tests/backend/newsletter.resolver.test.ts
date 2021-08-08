import { ApolloServer, gql } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import { TGraphQLContext } from '@cromwell/core-backend';

const typeorm = require('typeorm');
typeorm.getManager = () => ({
    find: () => [{ email: 'test1' }, { email: 'test2' }],
    save: jest.fn(),
    findOne: () => null,
});

import PluginNewsletterResolver from '../../src/backend/resolvers/plugin-newsletter.resolver';

describe('plugin-newsletter.resolver', () => {

    let server: ApolloServer;

    beforeAll(async () => {
        const schema = await buildSchema({
            resolvers: [PluginNewsletterResolver],
            validate: false,
            authChecker: () => true,
        });

        server = new ApolloServer({
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
    })

    it(`pluginNewsletterExport`, async () => {
        const res = await server.executeOperation({
            query: gql`
                query pluginNewsletterExport {
                    pluginNewsletterExport {
                        email
                    }
                }
           `
        });
        const newsletters = res?.data?.pluginNewsletterExport;

        expect(newsletters.length).toBe(2);
    });

    it(`pluginNewsletterStats`, async () => {
        const res = await server.executeOperation({
            query: gql`
                query pluginNewsletterStats {
                    pluginNewsletterStats
                }
           `
        });
        const stats = res?.data?.pluginNewsletterStats;

        expect(stats + '').toBe(2 + '');
    });

})