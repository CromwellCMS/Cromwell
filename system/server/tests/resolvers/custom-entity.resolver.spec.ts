import { GraphQLPaths, TBaseFilter, TCustomEntity, TCustomEntityInput, TPagedParams } from '@cromwell/core';
import { CustomEntityRepository } from '@cromwell/core-backend';
import { getGraphQLClient, TCGraphQLClient } from '@cromwell/core-frontend';
import { ApolloServer, gql } from 'apollo-server';
import { getCustomRepository } from 'typeorm';

import { setupResolver, tearDownResolver } from '../resolver.helpers';

describe('Custom entity resolver', () => {
    let server: ApolloServer;
    let crwClient: TCGraphQLClient | undefined;

    beforeAll(async () => {
        server = await setupResolver('Custom entity');
        crwClient = getGraphQLClient();

        for (let i = 0; i < 10; i++) {
            await getCustomRepository(CustomEntityRepository).createCustomEntity({
                entityType: `test_${i % 5}_${i}`,
                customMeta: {
                    test: `test_${i % 5}_${i}`,
                }
            }, i + 1);
        }
    });

    afterAll(async () => {
        await tearDownResolver(server);
    });

    const getCustomEntity = async (id: number, customMetaKeys?: string[]): Promise<TCustomEntity> => {
        const path = GraphQLPaths.CustomEntity.getOneById;
        const res = await server.executeOperation({
            query: gql`
            query testGetCustomEntityById($id: Int!) {
                ${path}(id: $id) {
                    id
                    entityType
                    customMeta(keys: ${JSON.stringify(customMetaKeys ?? [])})
                }
            }`,
            variables: {
                id
            }
        });
        const data = crwClient?.returnData(res, path);
        return data;
    }

    const updateEntity = async (id: number, input: TCustomEntityInput) => {
        const path = GraphQLPaths.CustomEntity.update;

        const res = await server.executeOperation({
            query: gql`
              mutation testUpdateCustomEntity($id: Int!, $data: CustomEntityInput!) {
                  ${path}(id: $id, data: $data) {
                      ...CustomEntityFragment
                  }
              }
              ${crwClient?.CustomEntityFragment}
          `,
            variables: {
                id,
                data: input,
            }
        });
        const success = crwClient?.returnData(res, path);
        return success;
    }


    const deleteEntity = async (id: number) => {
        const path = GraphQLPaths.CustomEntity.delete;

        const res = await server.executeOperation({
            query: gql`
                mutation testDeleteCustomEntity($id: Int!) {
                    ${path}(id: $id)
                }
            `,
            variables: {
                id,
            }
        });
        const success = crwClient?.returnData(res, path);
        return success;
    }


    const getFilteredCustomEntities = async (filterParams: TBaseFilter) => {
        const path = GraphQLPaths.CustomEntity.getFiltered;
        const res = await server.executeOperation({
            query: gql`
                query testGetFilteredCustomEntities($pagedParams: PagedParamsInput, $filterParams: CustomEntityFilterInput) {
                    ${path}(pagedParams: $pagedParams, filterParams: $filterParams) {
                        pagedMeta {
                            ...PagedMetaFragment
                        }
                        elements {
                            id
                            entityType
                            customMeta(keys: ["test"])
                        }
                    }
                }
                ${crwClient?.PagedMetaFragment}
            `,
            variables: {
                pagedParams: {
                    pageSize: 22,
                },
                filterParams,
            }
        });
        const data = crwClient?.returnData(res, path);
        return data;
    }


    it(`getCustomEntities`, async () => {
        const path = GraphQLPaths.CustomEntity.getMany;
        const res = await server.executeOperation({
            query: gql`
              query testGetCustomEntities($pagedParams: PagedParamsInput!) {
                  ${path}(pagedParams: $pagedParams) {
                      pagedMeta {
                          ...PagedMetaFragment
                      }
                      elements {
                            id
                            entityType
                            customMeta(keys: ["test"])
                      }
                  }
              }
              ${crwClient?.PagedMetaFragment}
          `,
            variables: {
                pagedParams: {
                    pageNumber: 1,
                } as TPagedParams<TCustomEntity>
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


    it(`getCustomEntity`, async () => {
        const data = await getCustomEntity(1);
        if (Array.isArray(data)) {
            console.error('data error', data)
            expect(!Array.isArray(data)).toBeTruthy();
        }

        expect(data).toBeTruthy();
        expect(data.id).toBeTruthy();
    });


    it(`updateCustomEntity and meta`, async () => {
        const data1 = await getCustomEntity(1);
        expect(data1).toBeTruthy();
        expect(data1.id).toBeTruthy();


        const inputData: TCustomEntityInput = {
            entityType: 'test2',
            customMeta: {
                testUpdate: 'testUpdate'
            }
        }
        const success = await updateEntity(data1.id, inputData);

        if (Array.isArray(success)) {
            console.error('res error', success)
            expect(!Array.isArray(success)).toBeTruthy();
        }

        const data2 = await getCustomEntity(data1.id, ['testUpdate']);
        if (Array.isArray(data2)) {
            console.error('data error', data2)
            expect(!Array.isArray(data2)).toBeTruthy();
        }

        expect(data2).toBeTruthy();
        expect(data2.id).toBeTruthy();
        expect(data2.entityType).toEqual(inputData.entityType);
        expect(data2.customMeta?.testUpdate).toEqual(inputData.customMeta?.testUpdate);

        await updateEntity(data1.id, {
            entityType: data1.entityType,
            customMeta: {
                testUpdate: null
            }
        });
        const data3 = await getCustomEntity(data1.id, ['testUpdate']);
        expect(data3).toBeTruthy();
        expect(data3.id).toBeTruthy();
        expect(data3.entityType).toEqual(data1.entityType);
        expect(data3.customMeta?.testUpdate).toBeFalsy();
    });


    it(`createCustomEntity`, async () => {
        const path = GraphQLPaths.CustomEntity.create;
        const inputData: TCustomEntityInput = {
            entityType: 'to_create',
        }

        const res = await server.executeOperation({
            query: gql`
              mutation testCreateCustomEntity($data: CustomEntityInput!) {
                  ${path}(data: $data) {
                      ...CustomEntityFragment
                  }
              }
              ${crwClient?.CustomEntityFragment}
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

        const data2 = await getCustomRepository(CustomEntityRepository).findOne({
            where: {
                entityType: inputData.entityType
            }
        });
        if (Array.isArray(data2)) {
            console.error('data error', data2)
            expect(!Array.isArray(data2)).toBeTruthy();
        }
        expect(data2).toBeTruthy();
        expect(data2?.id).toBeTruthy();
        expect(data2?.entityType).toEqual(inputData.entityType);

        await data2?.remove();
    });


    it(`deleteCustomEntity`, async () => {
        const entity = await getCustomRepository(CustomEntityRepository).createCustomEntity({
            entityType: `test_delete`,

        });
        const success = await deleteEntity(entity.id);

        if (Array.isArray(success)) {
            console.error('res error', success)
            expect(!Array.isArray(success)).toBeTruthy();
        }
        expect(success === true).toBeTruthy();

        const data2 = await getCustomEntity(entity.id);
        expect(!data2?.id).toBeTruthy();
    });


    it(`base filter by column`, async () => {
        const data = await getFilteredCustomEntities({
            filters: [
                {
                    key: 'entityType',
                    value: 'test_3',
                    inMeta: false,
                }
            ]
        });
        expect(data.elements.length).toBe(2);
    });

    it(`base filter by column exact`, async () => {
        const data = await getFilteredCustomEntities({
            filters: [
                {
                    key: 'entityType',
                    value: 'test_3_3',
                    exact: true,
                }
            ]
        });
        expect(data.elements.length).toBe(1);
    });


    it(`base filter by meta`, async () => {
        const data = await getFilteredCustomEntities({
            filters: [
                {
                    key: 'test',
                    value: '1_',
                    inMeta: true,
                }
            ]
        });

        expect(data.elements.length).toBe(2);
    });


    it(`base filter by meta exact`, async () => {
        const data = await getFilteredCustomEntities({
            filters: [
                {
                    key: 'test',
                    value: 'test_1_1',
                    exact: true,
                    inMeta: true,
                }
            ]
        });

        expect(data.elements.length).toBe(1);
    });



    it(`base sort by column desc`, async () => {
        const data = await getFilteredCustomEntities({
            sorts: [
                {
                    key: 'entityType',
                    sort: "DESC",
                }
            ]
        });

        expect(data.elements[0].entityType).toBe(`test_4_9`);
        expect(data.elements[0].customMeta.test).toBe(`test_4_9`);
    });


    it(`base sort by column asc`, async () => {
        const data = await getFilteredCustomEntities({
            sorts: [
                {
                    key: 'entityType',
                    sort: "ASC",
                }
            ]
        });


        expect(data.elements[0].entityType).toBe(`test_0_0`);
        expect(data.elements[0].customMeta.test).toBe(`test_0_0`);
    });



    it(`base sort by meta desc`, async () => {
        const data = await getFilteredCustomEntities({
            sorts: [
                {
                    key: 'test',
                    inMeta: true,
                    sort: "DESC",
                }
            ]
        });

        expect(data.elements[0].entityType).toBe(`test_4_9`);
        expect(data.elements[0].customMeta.test).toBe(`test_4_9`);
    });

});