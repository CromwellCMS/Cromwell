import { GraphQLPaths, TPagedParams, TTag, TTagInput } from '@cromwell/core';
import { TagRepository } from '@cromwell/core-backend';
import { getGraphQLClient, TCGraphQLClient } from '@cromwell/core-frontend';
import { ApolloServer, gql } from 'apollo-server';
import { getCustomRepository } from 'typeorm';

import { setupResolver, tearDownResolver } from '../resolver.helpers';

describe('Tag resolver', () => {
    let server: ApolloServer;
    let crwClient: TCGraphQLClient | undefined;

    beforeAll(async () => {
        server = await setupResolver('tag');
        crwClient = getGraphQLClient();
    });

    it(`getTags`, async () => {
        const path = GraphQLPaths.Tag.getMany;
        const res = await server.executeOperation({
            query: gql`
              query testGetTags($pagedParams: PagedParamsInput!) {
                  ${path}(pagedParams: $pagedParams) {
                      pagedMeta {
                          ...PagedMetaFragment
                      }
                      elements {
                          ...TagFragment
                      }
                  }
              }
              ${crwClient?.TagFragment}
              ${crwClient?.PagedMetaFragment}
          `,
            variables: {
                pagedParams: {
                    pageNumber: 1,
                } as TPagedParams<TTag>
            }
        });
        const data = crwClient?.returnData(res, path);
        if (Array.isArray(data)) {
            console.error('data error', data)
            expect(!Array.isArray(data)).toBeTruthy();
        }

        expect(data).toBeTruthy();
        expect(data.elements.length).toBeTruthy();
        expect(data.pagedMeta.pageSize).toBeTruthy();
    });

    const getTag = async (tagId: string): Promise<TTag> => {
        const path = GraphQLPaths.Tag.getOneById;
        const res = await server.executeOperation({
            query: gql`
            query testGetTagById($id: String!) {
                ${path}(id: $id) {
                    ...TagFragment
                }
            }
            ${crwClient?.TagFragment}
            `,
            variables: {
                id: tagId
            }
        });
        const data = crwClient?.returnData(res, path);
        return data;
    }

    it(`getTag`, async () => {
        const data = await getTag('1');
        if (Array.isArray(data)) {
            console.error('data error', data)
            expect(!Array.isArray(data)).toBeTruthy();
        }

        expect(data).toBeTruthy();
        expect(data.id).toBeTruthy();
    });

    it(`updateTag`, async () => {
        const data1 = await getTag('1');
        if (Array.isArray(data1)) {
            console.error('data error', data1)
            expect(!Array.isArray(data1)).toBeTruthy();
        }
        expect(data1).toBeTruthy();
        expect(data1.id).toBeTruthy();

        const path = GraphQLPaths.Tag.update;

        const inputData: TTagInput = {
            name: '__test__',
        }

        const res = await server.executeOperation({
            query: gql`
              mutation testUpdateTag($id: String!, $data: InputTag!) {
                  ${path}(id: $id, data: $data) {
                      ...TagFragment
                  }
              }
              ${crwClient?.TagFragment}
          `,
            variables: {
                id: '1',
                data: inputData,
            }
        });
        const success = crwClient?.returnData(res, path);
        if (Array.isArray(success)) {
            console.error('res error', success)
            expect(!Array.isArray(success)).toBeTruthy();
        }
        const data2 = await getTag('1');
        if (Array.isArray(data2)) {
            console.error('data error', data2)
            expect(!Array.isArray(data2)).toBeTruthy();
        }

        expect(data2).toBeTruthy();
        expect(data2.id).toBeTruthy();
        expect(data2.name).toEqual(inputData.name);
    });


    it(`createTag`, async () => {
        const data1: TTag = await getTag('3');
        if (Array.isArray(data1)) {
            console.error('data error', data1)
            expect(!Array.isArray(data1)).toBeTruthy();
        }
        expect(data1).toBeTruthy();
        expect(data1.id).toBeTruthy();

        const path = GraphQLPaths.Tag.create;

        const inputData: TTagInput = {
            name: '__test2__',
        }

        const res = await server.executeOperation({
            query: gql`
              mutation testCreateTag($data: InputTag!) {
                  ${path}(data: $data) {
                      ...TagFragment
                  }
              }
              ${crwClient?.TagFragment}
          `,
            variables: {
                data: inputData,
            }
        });
        const success = crwClient?.returnData(res, path);
        expect(success).toBeTruthy();
        if (Array.isArray(success)) {
            console.error('res error', success)
            expect(!Array.isArray(success)).toBeTruthy();
        }

        const data2 = await getCustomRepository(TagRepository).findOne({
            where: {
                name: inputData.name
            }
        });
        if (Array.isArray(data2)) {
            console.error('data error', data2)
            expect(!Array.isArray(data2)).toBeTruthy();
        }
        expect(data2).toBeTruthy();
        expect(data2?.id).toBeTruthy();
        expect(data2?.name).toEqual(inputData.name);
    });


    it(`deleteTag`, async () => {
        const data1 = await getTag('4');
        if (Array.isArray(data1)) {
            console.error('data error', data1)
            expect(!Array.isArray(data1)).toBeTruthy();
        }
        expect(data1).toBeTruthy();
        expect(data1.id).toBeTruthy();
        const path = GraphQLPaths.Tag.delete;

        const res = await server.executeOperation({
            query: gql`
                mutation testDeleteTag($id: String!) {
                    ${path}(id: $id)
                }
          `,
            variables: {
                id: '4',
            }
        });
        const success = crwClient?.returnData(res, path);
        if (Array.isArray(success)) {
            console.error('res error', success)
            expect(!Array.isArray(success)).toBeTruthy();
        }
        expect(success === true).toBeTruthy();

        const data2 = await getTag('4');

        expect(!data2?.id).toBeTruthy();
    });


    afterAll(async () => {
        await tearDownResolver(server);
    });
});