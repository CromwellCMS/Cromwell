import { GraphQLPaths, TPagedParams, TProductReview, TProductReviewInput } from '@cromwell/core';
import { ProductReviewRepository } from '@cromwell/core-backend';
import { getGraphQLClient, TCGraphQLClient } from '@cromwell/core-frontend';
import { ApolloServer, gql } from 'apollo-server';
import { getCustomRepository } from 'typeorm';

import { setupResolver, tearDownResolver } from '../resolver.helpers';

describe('Product-review resolver', () => {
    let server: ApolloServer;
    let crwClient: TCGraphQLClient | undefined;

    beforeAll(async () => {
        server = await setupResolver('product-review');
        crwClient = getGraphQLClient();
    });

    const query: typeof server.executeOperation = async (...args) => {
        const res = await server.executeOperation(...args);
        if (res.errors) throw res.errors;
        return res;
    }

    it(`getProductReviews`, async () => {
        const path = GraphQLPaths.ProductReview.getMany;
        const res = await query({
            query: gql`
              query testGetProducts($pagedParams: PagedParamsInput!) {
                  ${path}(pagedParams: $pagedParams) {
                      pagedMeta {
                          ...PagedMetaFragment
                      }
                      elements {
                          ...ProductReviewFragment
                      }
                  }
              }
              ${crwClient?.ProductReviewFragment}
              ${crwClient?.PagedMetaFragment}
          `,
            variables: {
                pagedParams: {
                    pageNumber: 1,
                    pageSize: 10
                } as TPagedParams<TProductReview>
            }
        });
        const data = crwClient?.returnData(res, path);
        if (Array.isArray(data)) {
            console.error('data error', data)
            expect(!Array.isArray(data)).toBeTruthy();
        }

        expect(data).toBeTruthy();
        expect(data.elements.length === 10).toBeTruthy();
        expect(data.pagedMeta.pageSize === 10).toBeTruthy();
    });

    const getProductReview = async (productReviewId: number) => {
        const path = GraphQLPaths.ProductReview.getOneById;
        const res = await server.executeOperation({
            query: gql`
            query testGetProductById($id: Int!) {
                ${path}(id: $id) {
                    ...ProductReviewFragment
                }
            }
            ${crwClient?.ProductReviewFragment}
            `,
            variables: {
                id: productReviewId
            }
        });
        const data = crwClient?.returnData(res, path);
        return data;
    }

    it(`getProductReview`, async () => {
        const data = await getProductReview(1);
        if (Array.isArray(data)) {
            console.error('data error', data)
            expect(!Array.isArray(data)).toBeTruthy();
        }

        expect(data).toBeTruthy();
        expect(data.id).toBeTruthy();
    });

    it(`updateProductReview`, async () => {
        const data1: TProductReview = await getProductReview(1);
        if (Array.isArray(data1)) {
            console.error('data error', data1)
            expect(!Array.isArray(data1)).toBeTruthy();
        }
        expect(data1).toBeTruthy();
        expect(data1.id).toBeTruthy();

        const path = GraphQLPaths.ProductReview.update;

        const updateProduct: TProductReviewInput = {
            title: '__test__',
            productId: data1.productId,
        }

        const res = await server.executeOperation({
            query: gql`
              mutation testUpdateProduct($id: Int!, $data: ProductReviewInput!) {
                  ${path}(id: $id, data: $data) {
                      ...ProductReviewFragment
                  }
              }
              ${crwClient?.ProductReviewFragment}
          `,
            variables: {
                id: 1,
                data: updateProduct,
            }
        });
        const success = crwClient?.returnData(res, path);
        if (Array.isArray(success)) {
            console.error('res error', success)
            expect(!Array.isArray(success)).toBeTruthy();
        }
        const data2 = await getProductReview(1);
        if (Array.isArray(data2)) {
            console.error('data error', data2)
            expect(!Array.isArray(data2)).toBeTruthy();
        }

        expect(data2).toBeTruthy();
        expect(data2.id).toBeTruthy();
        expect(data2.title).toBeTruthy();
        expect(data2.title === '__test__').toBeTruthy();
    });


    it(`createProductReview`, async () => {
        const data1: TProductReview = await getProductReview(3);
        if (Array.isArray(data1)) {
            console.error('data error', data1)
            expect(!Array.isArray(data1)).toBeTruthy();
        }
        expect(data1).toBeTruthy();
        expect(data1.id).toBeTruthy();

        const path = GraphQLPaths.ProductReview.create;

        const createProduct: TProductReviewInput = {
            title: '__test3__',
            productId: data1.productId,
        }

        const res = await server.executeOperation({
            query: gql`
              mutation testCreatePost($data: ProductReviewInput!) {
                  ${path}(data: $data) {
                      ...ProductReviewFragment
                  }
              }
              ${crwClient?.ProductReviewFragment}
          `,
            variables: {
                data: createProduct,
            }
        });
        const success = crwClient?.returnData(res, path);
        expect(success).toBeTruthy();
        if (Array.isArray(success)) {
            console.error('res error', success)
            expect(!Array.isArray(success)).toBeTruthy();
        }

        const data2 = await getCustomRepository(ProductReviewRepository).findOne({
            where: {
                title: '__test3__'
            }
        });
        if (Array.isArray(data2)) {
            console.error('data error', data2)
            expect(!Array.isArray(data2)).toBeTruthy();
        }
        expect(data2).toBeTruthy();
        expect(data2?.id).toBeTruthy();
        expect(data2?.title).toBeTruthy();
        expect(data2?.title === '__test3__').toBeTruthy();
    });


    it(`deleteProduct`, async () => {
        const data1: TProductReview = await getProductReview(4);
        if (Array.isArray(data1)) {
            console.error('data error', data1)
            expect(!Array.isArray(data1)).toBeTruthy();
        }
        expect(data1).toBeTruthy();
        expect(data1.id).toBeTruthy();
        const path = GraphQLPaths.ProductReview.delete;

        const res = await server.executeOperation({
            query: gql`
                mutation testDeleteProduct($id: Int!) {
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

        const data2 = await getProductReview(4).catch(() => null);

        expect(!data2?.id).toBeTruthy();
    });


    afterAll(async () => {
        await tearDownResolver(server);
    });
});