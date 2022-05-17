import { GraphQLPaths, TPagedParams, TProductCategory, TProductCategoryInput } from '@cromwell/core';
import { getGraphQLClient, TCGraphQLClient } from '@cromwell/core-frontend';
import { ApolloServer, gql } from 'apollo-server';

import { setupResolver, tearDownResolver } from '../resolver.helpers';

describe('Product category resolver', () => {
    let server: ApolloServer;
    let crwClient: TCGraphQLClient | undefined;

    beforeAll(async () => {
        server = await setupResolver('product-category');
        crwClient = getGraphQLClient();
    });

    const query: typeof server.executeOperation = async (...args) => {
        const res = await server.executeOperation(...args);
        if (res.errors) throw res.errors;
        return res;
    }

    it(`getProductCategories`, async () => {
        const path = GraphQLPaths.ProductCategory.getMany;
        const res = await query({
            query: gql`
              query testGetProducts($pagedParams: PagedParamsInput!) {
                  ${path}(pagedParams: $pagedParams) {
                      pagedMeta {
                          ...PagedMetaFragment
                      }
                      elements {
                          ...ProductCategoryFragment
                      }
                  }
              }
              ${crwClient?.ProductCategoryFragment}
              ${crwClient?.PagedMetaFragment}
          `,
            variables: {
                pagedParams: {
                    pageNumber: 1,
                    pageSize: 10
                } as TPagedParams<TProductCategory>
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

    const getProductCategoryById = async (id: number) => {
        const path = GraphQLPaths.ProductCategory.getOneById;
        const res = await query({
            query: gql`
            query testGetProductCategoryById($id: Int!) {
                ${path}(id: $id) {
                    ...ProductCategoryFragment
                }
            }
            ${crwClient?.ProductCategoryFragment}
            `,
            variables: {
                id
            }
        });
        const data = crwClient?.returnData(res, path);
        return data;
    }

    it(`getProductCategoryById`, async () => {
        const data = await getProductCategoryById(1);
        if (Array.isArray(data)) {
            console.error('data error', data)
            expect(!Array.isArray(data)).toBeTruthy();
        }

        expect(data).toBeTruthy();
        expect(data.id).toBeTruthy();
        expect(data.slug).toBeTruthy();
    });

    const getProductCategoryBySlug = async (slug: string) => {
        const path = GraphQLPaths.ProductCategory.getOneBySlug;
        const res = await query({
            query: gql`
            query testGetProductCategoryBySlug($slug: String!) {
                ${path}(slug: $slug) {
                    ...ProductCategoryFragment
                }
            }
            ${crwClient?.ProductCategoryFragment}
            `,
            variables: {
                slug
            }
        });
        const data = crwClient?.returnData(res, path);
        return data;
    }

    it(`getProductCategoryBySlug`, async () => {
        const data = await getProductCategoryBySlug('1');
        if (Array.isArray(data)) {
            console.error('data error', data)
            expect(!Array.isArray(data)).toBeTruthy();
        }
        expect(data).toBeTruthy();
        expect(data.id).toBeTruthy();
        expect(data.slug).toBeTruthy();
    });

    it(`updateProductCategory`, async () => {
        const data1: TProductCategory = await getProductCategoryById(2);
        if (Array.isArray(data1)) {
            console.error('data error', data1)
            expect(!Array.isArray(data1)).toBeTruthy();
        }
        expect(data1).toBeTruthy();
        expect(data1.id).toBeTruthy();
        expect(data1.slug).toBeTruthy();

        const path = GraphQLPaths.ProductCategory.update;

        const updateProduct: TProductCategoryInput = {
            slug: '__test__',
            name: data1.name,
            pageTitle: data1.pageTitle,
            mainImage: data1.mainImage,
            isEnabled: data1.isEnabled,
        }

        const res = await query({
            query: gql`
              mutation testUpdateProductCategory($id: Int!, $data: UpdateProductCategory!) {
                  ${path}(id: $id, data: $data) {
                      ...ProductCategoryFragment
                  }
              }
              ${crwClient?.ProductCategoryFragment}
          `,
            variables: {
                id: 2,
                data: updateProduct,
            }
        });
        const success = crwClient?.returnData(res, path);
        if (Array.isArray(success)) {
            console.error('res error', success)
            expect(!Array.isArray(success)).toBeTruthy();
        }
        const data2 = await getProductCategoryById(2);
        if (Array.isArray(data2)) {
            console.error('data error', data2)
            expect(!Array.isArray(data2)).toBeTruthy();
        }

        expect(data2).toBeTruthy();
        expect(data2.id).toBeTruthy();
        expect(data2.slug).toBeTruthy();
        expect(data2.slug === '__test__').toBeTruthy();
    });


    it(`createProductCategory`, async () => {
        const data1: TProductCategory = await getProductCategoryById(2);
        if (Array.isArray(data1)) {
            console.error('data error', data1)
            expect(!Array.isArray(data1)).toBeTruthy();
        }
        expect(data1).toBeTruthy();
        expect(data1.id).toBeTruthy();
        expect(data1.slug).toBeTruthy();

        const path = GraphQLPaths.ProductCategory.create;

        const createProduct: TProductCategoryInput = {
            slug: '__test3__',
            name: data1.name,
            pageTitle: data1.pageTitle,
            mainImage: data1.mainImage,
            isEnabled: data1.isEnabled,
        }

        const res = await query({
            query: gql`
              mutation testCreatePost($data: CreateProductCategory!) {
                  ${path}(data: $data) {
                      ...ProductCategoryFragment
                  }
              }
              ${crwClient?.ProductCategoryFragment}
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

        const data2 = await getProductCategoryBySlug('__test3__');
        if (Array.isArray(data2)) {
            console.error('data error', data2)
            expect(!Array.isArray(data2)).toBeTruthy();
        }
        expect(data2).toBeTruthy();
        expect(data2.id).toBeTruthy();
        expect(data2.slug).toBeTruthy();
        expect(data2.slug === '__test3__').toBeTruthy();
    });


    it(`deleteProductCategory`, async () => {
        const data1: TProductCategory = await getProductCategoryById(4);
        if (Array.isArray(data1)) {
            console.error('data error', data1)
            expect(!Array.isArray(data1)).toBeTruthy();
        }
        expect(data1).toBeTruthy();
        expect(data1.id).toBeTruthy();
        expect(data1.slug).toBeTruthy();
        const path = GraphQLPaths.ProductCategory.delete;

        const res = await query({
            query: gql`
                mutation testDeleteProductCategory($id: Int!) {
                    ${path}(id: $id)
                }
          `,
            variables: {
                id: 3,
            }
        });
        const success = crwClient?.returnData(res, path);
        if (Array.isArray(success)) {
            console.error('res error', JSON.stringify(success, null, 2))
            expect(!Array.isArray(success)).toBeTruthy();
        }
        expect(success === true).toBeTruthy();

        const data2 = await getProductCategoryById(3).catch(() => null);

        expect(!data2?.id).toBeTruthy();
        expect(!data2?.slug).toBeTruthy();
    });


    afterAll(async () => {
        await tearDownResolver(server);
    });
});