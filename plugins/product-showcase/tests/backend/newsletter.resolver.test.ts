import { ApolloServer, gql } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import { TGraphQLContext } from '@cromwell/core-backend';

const typeorm = require('typeorm');
typeorm.getCustomRepository = () => ({
    getBySlug: jest.fn(),
    getProductsFromCategory: jest.fn(),
    getProducts: () => ({ elements: [{ name: 'test1' }, { name: 'test2' }] }),
    getPluginSettings: () => null,
});

import PluginProductShowcaseResolver from '../../src/backend/resolvers/product-showcase.resolver';

describe('product-showcase.resolver', () => {

    let server: ApolloServer;

    beforeAll(async () => {
        const schema = await buildSchema({
            resolvers: [PluginProductShowcaseResolver],
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

    it(`pluginProductShowcase`, async () => {
        const res = await server.executeOperation({
            query: gql`
                query pluginProductShowcase($slug: String) {
                    pluginProductShowcase(slug: $slug) {
                        elements {
                            name
                        }
                    }
                }
           `,
            variables: { slug: null }
        });
        const data = res?.data?.pluginProductShowcase?.elements;

        expect(data.length).toBe(2);
    });

})