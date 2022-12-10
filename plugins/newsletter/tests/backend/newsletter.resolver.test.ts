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
            id: 1,
            email: 'test@test.org',
            roles: [{ name: 'administrator', permissions: ['all'], id: 1 }],
          },
        };
      },
    });
  });

  it(`pluginNewsletterExport`, async () => {
    const res = await server.executeOperation({
      query: gql`
        query pluginNewsletterExport {
          pluginNewsletterExport {
            email
          }
        }
      `,
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
      `,
    });
    const stats = res?.data?.pluginNewsletterStats;

    expect(stats + '').toBe(2 + '');
  });
});
