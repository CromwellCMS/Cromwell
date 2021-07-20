import { GraphQLPaths, TOrder, TOrderInput, TPagedParams } from '@cromwell/core';
import { OrderRepository } from '@cromwell/core-backend';
import { getGraphQLClient, TCGraphQLClient } from '@cromwell/core-frontend';
import { ApolloServer, gql } from 'apollo-server';
import { getCustomRepository } from 'typeorm';

import { setupResolver, tearDownResolver } from '../resolver.helpers';

describe('Order resolver', () => {
    let server: ApolloServer;
    let crwClient: TCGraphQLClient | undefined;

    beforeAll(async () => {
        [server] = await setupResolver('order');
        crwClient = getGraphQLClient();
    });

    it(`getOrders`, async () => {
        const path = GraphQLPaths.Order.getMany;
        const res = await server.executeOperation({
            query: gql`
              query testGetOrders($pagedParams: PagedParamsInput!) {
                  ${path}(pagedParams: $pagedParams) {
                      pagedMeta {
                          ...PagedMetaFragment
                      }
                      elements {
                          ...OrderFragment
                      }
                  }
              }
              ${crwClient?.OrderFragment}
              ${crwClient?.PagedMetaFragment}
          `,
            variables: {
                pagedParams: {
                    pageNumber: 1,
                } as TPagedParams<TOrder>
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

    const getOrder = async (orderId: string): Promise<TOrder> => {
        const path = GraphQLPaths.Order.getOneById;
        const res = await server.executeOperation({
            query: gql`
            query testGetOrderById($id: String!) {
                ${path}(id: $id) {
                    ...OrderFragment
                }
            }
            ${crwClient?.OrderFragment}
            `,
            variables: {
                id: orderId
            }
        });
        const data = crwClient?.returnData(res, path);
        return data;
    }

    it(`getOrder`, async () => {
        const data = await getOrder('1');
        if (Array.isArray(data)) {
            console.error('data error', data)
            expect(!Array.isArray(data)).toBeTruthy();
        }

        expect(data).toBeTruthy();
        expect(data.id).toBeTruthy();
    });

    it(`updateOrder`, async () => {
        const data1 = await getOrder('1');
        if (Array.isArray(data1)) {
            console.error('data error', data1)
            expect(!Array.isArray(data1)).toBeTruthy();
        }
        expect(data1).toBeTruthy();
        expect(data1.id).toBeTruthy();

        const path = GraphQLPaths.Order.update;

        const inputData: TOrderInput = {
            customerName: '__test__',
            cartTotalPrice: 111.222,
        }

        const res = await server.executeOperation({
            query: gql`
              mutation testUpdateOrder($id: String!, $data: InputOrder!) {
                  ${path}(id: $id, data: $data) {
                      ...OrderFragment
                  }
              }
              ${crwClient?.OrderFragment}
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
        const data2 = await getOrder('1');
        if (Array.isArray(data2)) {
            console.error('data error', data2)
            expect(!Array.isArray(data2)).toBeTruthy();
        }

        expect(data2).toBeTruthy();
        expect(data2.id).toBeTruthy();
        expect(data2.customerName).toEqual(inputData.customerName);
    });


    it(`createOrder`, async () => {
        const data1: TOrder = await getOrder('3');
        if (Array.isArray(data1)) {
            console.error('data error', data1)
            expect(!Array.isArray(data1)).toBeTruthy();
        }
        expect(data1).toBeTruthy();
        expect(data1.id).toBeTruthy();

        const path = GraphQLPaths.Order.create;

        const inputData: TOrderInput = {
            customerName: '__test2__',
            cartTotalPrice: 111.222,
        }

        const res = await server.executeOperation({
            query: gql`
              mutation testCreateOrder($data: InputOrder!) {
                  ${path}(data: $data) {
                      ...OrderFragment
                  }
              }
              ${crwClient?.OrderFragment}
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

        const data2 = await getCustomRepository(OrderRepository).findOne({
            where: {
                customerName: inputData.customerName
            }
        });
        if (Array.isArray(data2)) {
            console.error('data error', data2)
            expect(!Array.isArray(data2)).toBeTruthy();
        }
        expect(data2).toBeTruthy();
        expect(data2?.id).toBeTruthy();
        expect(data2?.customerName).toEqual(inputData.customerName);
    });


    it(`deleteOrder`, async () => {
        const data1 = await getOrder('4');
        if (Array.isArray(data1)) {
            console.error('data error', data1)
            expect(!Array.isArray(data1)).toBeTruthy();
        }
        expect(data1).toBeTruthy();
        expect(data1.id).toBeTruthy();
        const path = GraphQLPaths.Order.delete;

        const res = await server.executeOperation({
            query: gql`
                mutation testDeleteOrder($id: String!) {
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

        const data2 = await getOrder('4');

        expect(!data2?.id).toBeTruthy();
    });


    afterAll(async () => {
        await tearDownResolver(server);
    });
});