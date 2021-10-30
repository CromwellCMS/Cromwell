import { GraphQLPaths, TPluginEntityInput } from '@cromwell/core';
import { GenericPlugin } from '@cromwell/core-backend';
import { getGraphQLClient, TCGraphQLClient } from '@cromwell/core-frontend';
import { ApolloServer, gql } from 'apollo-server';
import { getCustomRepository } from 'typeorm';

import { setupResolver, tearDownResolver } from '../resolver.helpers';

describe('Generic resolver', () => {
    // Tests via Theme resolver
    let server: ApolloServer;
    let crwClient: TCGraphQLClient | undefined;
    const entityName = 'Plugin';
    let fragmentName;
    let fragment;

    beforeAll(async () => {
        server = await setupResolver('generic');
        crwClient = getGraphQLClient();

        fragment = crwClient?.PluginFragment;
        fragmentName = 'PluginFragment';
    });

    it(`getGeneric`, async () => {
        const path = GraphQLPaths.Generic.getMany + entityName;
        const res = await server.executeOperation({
            query: gql`
              query testGetGenerics($pagedParams: PagedParamsInput!) {
                ${path} {
                    ...${fragmentName}
                }
              }
              ${fragment}
          `,
        });
        const data = crwClient?.returnData(res, path);

        expect(data).toBeTruthy();
        expect(Array.isArray(data)).toBeTruthy();
    });

    const getGenericById = async (id: number) => {
        const path = GraphQLPaths.Generic.getOneById + entityName;
        const res = await server.executeOperation({
            query: gql`
                query testGenericGetEntityById($id: String!) {
                    ${path}(id: $id) {
                        ...${fragmentName}
                    }
                }
                ${fragment}
            `,
            variables: {
                id
            }
        });
        const data = crwClient?.returnData(res, path);
        return data;
    }

    const getDefaultId = async (): Promise<number | undefined> => {
        return (await getCustomRepository(GenericPlugin.repository).find())[0]?.id;
    }
    const getDefaultSlug = async (): Promise<string | undefined> => {
        return (await getCustomRepository(GenericPlugin.repository).find())[0]?.slug;
    }

    it(`getGenericById`, async () => {
        const id = await getDefaultId();
        expect(id).toBeTruthy();
        if (!id) return;

        const data = await getGenericById(id);
        if (Array.isArray(data)) {
            console.error('data error', data)
            expect(!Array.isArray(data)).toBeTruthy();
        }

        expect(data).toBeTruthy();
        expect(data.id).toBeTruthy();
        expect(data.slug).toBeTruthy();
    });

    const getGenericBySlug = async (slug: string) => {
        const path = GraphQLPaths.Generic.getOneBySlug + entityName;
        const res = await server.executeOperation({
            query: gql`
                query testGenericGetEntityBySlug($slug: String!) {
                    ${path}(slug: $slug) {
                        ...${fragmentName}
                    }
                }
                ${fragment}
            `,
            variables: {
                slug
            }
        });
        const data = crwClient?.returnData(res, path);
        return data;
    }

    it(`getGenericBySlug`, async () => {
        const slug = await getDefaultSlug();
        expect(slug).toBeTruthy();
        if (!slug) return;

        const data = await getGenericBySlug(slug);
        if (Array.isArray(data)) {
            console.error('data error', data)
            expect(!Array.isArray(data)).toBeTruthy();
        }
        expect(data).toBeTruthy();
        expect(data.id).toBeTruthy();
        expect(data.slug).toBeTruthy();
    });

    it(`updateGeneric`, async () => {
        const id = await getDefaultId();
        expect(id).toBeTruthy();
        if (!id) return;

        const data1 = await getGenericById(id);
        if (Array.isArray(data1)) {
            console.error('data error', data1)
            expect(!Array.isArray(data1)).toBeTruthy();
        }
        expect(data1).toBeTruthy();
        expect(data1.id).toBeTruthy();
        expect(data1.slug).toBeTruthy();

        const path = GraphQLPaths.Generic.update + entityName;

        const updateEntity: TPluginEntityInput = {
            slug: '__test__',
            name: data1.name,
            pageTitle: data1.pageTitle,
            isInstalled: data1.isInstalled,
        }

        const res = await server.executeOperation({
            query: gql`
              mutation testUpdateGeneric($id: String!, $data: PluginInput!) {
                  ${path}(id: $id, data: $data) {
                      ...${fragmentName}
                  }
              }
              ${fragment}
          `,
            variables: {
                id: id,
                data: updateEntity,
            }
        });
        const success = crwClient?.returnData(res, path);
        if (Array.isArray(success)) {
            console.error('res error', success)
            expect(!Array.isArray(success)).toBeTruthy();
        }
        const data2 = await getGenericById(id);
        if (Array.isArray(data2)) {
            console.error('data error', data2)
            expect(!Array.isArray(data2)).toBeTruthy();
        }

        expect(data2).toBeTruthy();
        expect(data2.id).toBeTruthy();
        expect(data2.slug).toBeTruthy();
        expect(data2.slug === '__test__').toBeTruthy();
    });


    it(`createGeneric`, async () => {
        const id = await getDefaultId();
        expect(id).toBeTruthy();
        if (!id) return;

        const data1 = await getGenericById(id);
        if (Array.isArray(data1)) {
            console.error('data error', data1)
            expect(!Array.isArray(data1)).toBeTruthy();
        }
        expect(data1).toBeTruthy();
        expect(data1.id).toBeTruthy();

        const path = GraphQLPaths.Generic.create + entityName;

        const createEntity: TPluginEntityInput = {
            slug: '__test3__',
            name: data1.name,
            pageTitle: data1.pageTitle,
            isInstalled: data1.isInstalled,
        }

        const res = await server.executeOperation({
            query: gql`
              mutation testCreatePost($data: PluginInput!) {
                  ${path}(data: $data) {
                      ...${fragmentName}
                  }
              }
              ${fragment}
          `,
            variables: {
                data: createEntity,
            }
        });
        const success = crwClient?.returnData(res, path);
        expect(success).toBeTruthy();
        if (Array.isArray(success)) {
            console.error('res error', success)
            expect(!Array.isArray(success)).toBeTruthy();
        }

        const data2 = await getGenericBySlug('__test3__');
        if (Array.isArray(data2)) {
            console.error('data error', data2)
            expect(!Array.isArray(data2)).toBeTruthy();
        }
        expect(data2).toBeTruthy();
        expect(data2.id).toBeTruthy();
        expect(data2.slug).toBeTruthy();
        expect(data2.slug === '__test3__').toBeTruthy();
    });


    it(`deleteGeneric`, async () => {
        const id = await getDefaultId();
        expect(id).toBeTruthy();
        if (!id) return;

        const data1 = await getGenericById(id);
        if (Array.isArray(data1)) {
            console.error('data error', data1)
            expect(!Array.isArray(data1)).toBeTruthy();
        }
        expect(data1).toBeTruthy();
        expect(data1.id).toBeTruthy();
        const path = GraphQLPaths.Generic.delete + entityName;

        const res = await server.executeOperation({
            query: gql`
                mutation testDeleteGeneric($id: String!) {
                    ${path}(id: $id)
                }
          `,
            variables: {
                id: id,
            }
        });
        const success = crwClient?.returnData(res, path);
        if (Array.isArray(success)) {
            console.error('res error', success)
            expect(!Array.isArray(success)).toBeTruthy();
        }
        expect(success === true).toBeTruthy();

        const data2 = await getGenericById(id);

        expect(!data2?.id).toBeTruthy();
        expect(!data2?.slug).toBeTruthy();
    });


    afterAll(async () => {
        await tearDownResolver(server);
    });
});