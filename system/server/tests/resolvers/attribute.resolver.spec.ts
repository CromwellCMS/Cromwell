import { GraphQLPaths, TAttribute, TAttributeInput } from '@cromwell/core';
import { AttributeRepository } from '@cromwell/core-backend';
import { getGraphQLClient, TCGraphQLClient } from '@cromwell/core-frontend';
import { ApolloServer, gql } from 'apollo-server';
import { getCustomRepository } from 'typeorm';

import { setupResolver, tearDownResolver } from '../resolver.helpers';

describe('Attribute resolver', () => {
    let server: ApolloServer;
    let crwClient: TCGraphQLClient | undefined;

    beforeAll(async () => {
        server = await setupResolver('attribute');
        crwClient = getGraphQLClient();
    });

    it(`getAttributes`, async () => {
        const path = GraphQLPaths.Attribute.getMany;
        const res = await server.executeOperation({
            query: gql`
                query coreGetAttributes {
                    ${path} {
                        ...AttributeFragment
                    }
                }
                ${crwClient?.AttributeFragment}
           `
        });
        const data = crwClient?.returnData(res, path);

        expect(data).toBeTruthy();
        expect(data.length).toBeTruthy();
    });

    const getAttributeById = async (attributeId: string) => {
        const path = GraphQLPaths.Attribute.getOneById;
        const res = await server.executeOperation({
            query: gql`
            query testGetAttributeById($attributeId: String!) {
                ${path}(id: $attributeId) {
                    ...AttributeFragment
                }
            }
            ${crwClient?.AttributeFragment}
            `,
            variables: {
                attributeId
            }
        });
        const data = crwClient?.returnData(res, path);
        return data;
    }

    it(`getAttributeById`, async () => {
        const data = await getAttributeById('1');

        expect(data).toBeTruthy();
        expect(data.id).toBeTruthy();
        expect(data.slug).toBeTruthy();
    });

    it(`updateAttribute`, async () => {
        const data1: TAttribute = await getAttributeById('1');
        expect(data1).toBeTruthy();
        expect(data1.id).toBeTruthy();

        const path = GraphQLPaths.Attribute.update;

        const update: TAttributeInput = {
            key: data1.key,
            type: data1.type,
            icon: data1.icon,
            slug: '__test__',
            values: [],
        }

        const res = await server.executeOperation({
            query: gql`
              mutation testUpdateAttribute($id: String!, $data: AttributeInput!) {
                  ${path}(id: $id, data: $data) {
                      ...AttributeFragment
                  }
              }
              ${crwClient?.AttributeFragment}
          `,
            variables: {
                id: '1',
                data: update,
            }
        });
        const resInfo = crwClient?.returnData(res, path);
        expect(resInfo).toBeTruthy();
        expect(!Array.isArray(resInfo)).toBeTruthy();

        const data2 = await getAttributeById('1');

        expect(data2).toBeTruthy();
        expect(data2.id).toBeTruthy();
        expect(data2.slug).toBeTruthy();
        expect(data2.slug === '__test__').toBeTruthy();
    });


    it(`createAttribute`, async () => {
        const data1: TAttribute = await getAttributeById('1');
        expect(data1).toBeTruthy();
        expect(data1.id).toBeTruthy();
        expect(data1.slug).toBeTruthy();

        const path = GraphQLPaths.Attribute.create;

        const createAttribute: TAttributeInput = {
            slug: '__test2__',
            key: data1.key,
            type: data1.type,
            icon: data1.icon,
            values: [],
        }

        const res = await server.executeOperation({
            query: gql`
              mutation testCreateAttribute($data: AttributeInput!) {
                  ${path}(data: $data) {
                      ...AttributeFragment
                  }
              }
              ${crwClient?.AttributeFragment}
          `,
            variables: {
                data: createAttribute,
            }
        });
        const success = crwClient?.returnData(res, path);
        expect(success).toBeTruthy();
        expect(!Array.isArray(success)).toBeTruthy();

        const data2 = await getCustomRepository(AttributeRepository).getBySlug('__test2__')

        expect(data2).toBeTruthy();
        expect(data2?.id).toBeTruthy();
        expect(data2?.slug).toBeTruthy();
        expect(data2?.slug === '__test2__').toBeTruthy();
    });


    it(`deleteAttribute`, async () => {
        const data1: TAttribute = await getAttributeById('1');
        expect(data1).toBeTruthy();
        expect(data1.id).toBeTruthy();
        expect(data1.slug).toBeTruthy();

        const path = GraphQLPaths.Attribute.delete;

        const res = await server.executeOperation({
            query: gql`
                mutation testDeleteAttribute($id: String!) {
                    ${path}(id: $id)
                }
          `,
            variables: {
                id: '1',
            }
        });
        const success = crwClient?.returnData(res, path);
        expect(!success.ValidationError).toBeTruthy();
        expect(success === true).toBeTruthy();

        const data2 = await getAttributeById('1');

        expect(!data2?.id).toBeTruthy();
        expect(!data2?.slug).toBeTruthy();
    });


    afterAll(async () => {
        await tearDownResolver(server);
    });
});