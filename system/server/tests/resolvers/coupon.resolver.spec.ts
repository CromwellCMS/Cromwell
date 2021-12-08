import { GraphQLPaths, TPagedParams, TCoupon, TCouponInput } from '@cromwell/core';
import { CouponRepository } from '@cromwell/core-backend';
import { getGraphQLClient, TCGraphQLClient } from '@cromwell/core-frontend';
import { ApolloServer, gql } from 'apollo-server';
import { getCustomRepository } from 'typeorm';

import { setupResolver, tearDownResolver } from '../resolver.helpers';

describe('Coupon resolver', () => {
    let server: ApolloServer;
    let crwClient: TCGraphQLClient | undefined;

    beforeAll(async () => {
        server = await setupResolver('coupon');
        crwClient = getGraphQLClient();
    });

    it(`getCoupons`, async () => {
        const path = GraphQLPaths.Coupon.getMany;
        const res = await server.executeOperation({
            query: gql`
              query testGetCoupons($pagedParams: PagedParamsInput!) {
                  ${path}(pagedParams: $pagedParams) {
                      pagedMeta {
                          ...PagedMetaFragment
                      }
                      elements {
                          ...CouponFragment
                      }
                  }
              }
              ${crwClient?.CouponFragment}
              ${crwClient?.PagedMetaFragment}
          `,
            variables: {
                pagedParams: {
                    pageNumber: 1,
                } as TPagedParams<TCoupon>
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

    const getCoupon = async (couponId: number): Promise<TCoupon> => {
        const path = GraphQLPaths.Coupon.getOneById;
        const res = await server.executeOperation({
            query: gql`
            query testGetCouponById($id: Int!) {
                ${path}(id: $id) {
                    ...CouponFragment
                }
            }
            ${crwClient?.CouponFragment}
            `,
            variables: {
                id: couponId
            }
        });
        const data = crwClient?.returnData(res, path);
        return data;
    }

    it(`getCoupon`, async () => {
        const data = await getCoupon(1);
        if (Array.isArray(data)) {
            console.error('data error', data)
            expect(!Array.isArray(data)).toBeTruthy();
        }

        expect(data).toBeTruthy();
        expect(data.id).toBeTruthy();
    });

    it(`updateCoupon`, async () => {
        const data1 = await getCoupon(1);
        if (Array.isArray(data1)) {
            console.error('data error', data1)
            expect(!Array.isArray(data1)).toBeTruthy();
        }
        expect(data1).toBeTruthy();
        expect(data1.id).toBeTruthy();

        const path = GraphQLPaths.Coupon.update;

        const inputData: TCouponInput = {
            code: '__test__',
            discountType: 'fixed',
            value: 12,
        }

        const res = await server.executeOperation({
            query: gql`
              mutation testUpdateCoupon($id: Int!, $data: CouponInput!) {
                  ${path}(id: $id, data: $data) {
                      ...CouponFragment
                  }
              }
              ${crwClient?.CouponFragment}
          `,
            variables: {
                id: 1,
                data: inputData,
            }
        });
        const success = crwClient?.returnData(res, path);
        if (Array.isArray(success)) {
            console.error('res error', success)
            expect(!Array.isArray(success)).toBeTruthy();
        }
        const data2 = await getCoupon(1);
        if (Array.isArray(data2)) {
            console.error('data error', data2)
            expect(!Array.isArray(data2)).toBeTruthy();
        }

        expect(data2).toBeTruthy();
        expect(data2.id).toBeTruthy();
        expect(data2.code).toEqual(inputData.code);
    });


    it(`createCoupon`, async () => {
        const data1: TCoupon = await getCoupon(3);
        if (Array.isArray(data1)) {
            console.error('data error', data1)
            expect(!Array.isArray(data1)).toBeTruthy();
        }
        expect(data1).toBeTruthy();
        expect(data1.id).toBeTruthy();

        const path = GraphQLPaths.Coupon.create;

        const inputData: TCouponInput = {
            code: '__test__',
            discountType: 'fixed',
            value: 12,
        }

        const res = await server.executeOperation({
            query: gql`
              mutation testCreateCoupon($data: CouponInput!) {
                  ${path}(data: $data) {
                      ...CouponFragment
                  }
              }
              ${crwClient?.CouponFragment}
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

        const data2 = await getCustomRepository(CouponRepository).findOne({
            where: {
                code: inputData.code
            }
        });
        if (Array.isArray(data2)) {
            console.error('data error', data2)
            expect(!Array.isArray(data2)).toBeTruthy();
        }
        expect(data2).toBeTruthy();
        expect(data2?.id).toBeTruthy();
        expect(data2?.code).toEqual(inputData.code);
    });


    it(`deleteCoupon`, async () => {
        const data1 = await getCoupon(4);
        if (Array.isArray(data1)) {
            console.error('data error', data1)
            expect(!Array.isArray(data1)).toBeTruthy();
        }
        expect(data1).toBeTruthy();
        expect(data1.id).toBeTruthy();
        const path = GraphQLPaths.Coupon.delete;

        const res = await server.executeOperation({
            query: gql`
                mutation testDeleteCoupon($id: Int!) {
                    ${path}(id: $id)
                }
          `,
            variables: {
                id: 4,
            }
        });
        const success = crwClient?.returnData(res, path);
        if (Array.isArray(success)) {
            console.error('res error', success)
            expect(!Array.isArray(success)).toBeTruthy();
        }
        expect(success === true).toBeTruthy();

        const data2 = await getCoupon(4);

        expect(!data2?.id).toBeTruthy();
    });


    afterAll(async () => {
        await tearDownResolver(server);
    });
});