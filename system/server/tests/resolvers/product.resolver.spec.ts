import { GraphQLPaths, TPagedParams, TProduct, TProductInput } from '@cromwell/core';
import { getGraphQLClient, TCGraphQLClient } from '@cromwell/core-frontend';
import { ApolloServer, gql } from 'apollo-server';

import { setupResolver, tearDownResolver } from '../resolver.helpers';

describe('Product resolver', () => {
  let server: ApolloServer;
  let crwClient: TCGraphQLClient | undefined;

  beforeAll(async () => {
    server = await setupResolver('product');
    crwClient = getGraphQLClient();
  });

  const query: typeof server.executeOperation = async (...args) => {
    const res = await server.executeOperation(...args);
    if (res.errors) throw res.errors;
    return res;
  };

  it(`getProducts`, async () => {
    const path = GraphQLPaths.Product.getMany;
    const res = await query({
      query: gql`
              query testGetProducts($pagedParams: PagedParamsInput!) {
                  ${path}(pagedParams: $pagedParams) {
                      pagedMeta {
                          ...PagedMetaFragment
                      }
                      elements {
                          ...ProductFragment
                      }
                  }
              }
              ${crwClient?.ProductFragment}
              ${crwClient?.PagedMetaFragment}
          `,
      variables: {
        pagedParams: {
          pageNumber: 1,
          pageSize: 10,
        } as TPagedParams<TProduct>,
      },
    });
    const data = crwClient?.returnData(res, path);
    if (Array.isArray(data)) {
      console.error('data error', data);
      expect(!Array.isArray(data)).toBeTruthy();
    }

    expect(data).toBeTruthy();
    expect(data.elements.length === 10).toBeTruthy();
    expect(data.pagedMeta.pageSize === 10).toBeTruthy();
  });

  const getProductById = async (productId: number) => {
    const path = GraphQLPaths.Product.getOneById;
    const res = await query({
      query: gql`
            query testGetProductById($productId: Int!) {
                ${path}(id: $productId) {
                    ...ProductFragment
                }
            }
            ${crwClient?.ProductFragment}
            `,
      variables: {
        productId,
      },
    });
    const data = crwClient?.returnData(res, path);
    return data;
  };

  it(`getProductById`, async () => {
    const data = await getProductById(1);
    if (Array.isArray(data)) {
      console.error('data error', data);
      expect(!Array.isArray(data)).toBeTruthy();
    }

    expect(data).toBeTruthy();
    expect(data.id).toBeTruthy();
    expect(data.slug).toBeTruthy();
  });

  const getProductBySlug = async (slug: string) => {
    const path = GraphQLPaths.Product.getOneBySlug;
    const res = await query({
      query: gql`
            query testGetProductBySlug($slug: String!) {
                ${path}(slug: $slug) {
                    ...ProductFragment
                }
            }
            ${crwClient?.ProductFragment}
            `,
      variables: {
        slug,
      },
    });
    const data = crwClient?.returnData(res, path);
    return data;
  };

  it(`getProductBySlug`, async () => {
    const data = await getProductBySlug('1');
    if (Array.isArray(data)) {
      console.error('data error', data);
      expect(!Array.isArray(data)).toBeTruthy();
    }
    expect(data).toBeTruthy();
    expect(data.id).toBeTruthy();
    expect(data.slug).toBeTruthy();
  });

  it(`updateProduct`, async () => {
    const data1: TProduct = await getProductById(2);
    if (Array.isArray(data1)) {
      console.error('data error', data1);
      expect(!Array.isArray(data1)).toBeTruthy();
    }
    expect(data1).toBeTruthy();
    expect(data1.id).toBeTruthy();
    expect(data1.slug).toBeTruthy();

    const path = GraphQLPaths.Product.update;

    const updateProduct: TProductInput = {
      slug: '__test__',
      name: data1.name,
      pageTitle: data1.pageTitle,
      mainImage: data1.mainImage,
      isEnabled: data1.isEnabled,
    };

    const res = await query({
      query: gql`
              mutation testUpdateProduct($id: Int!, $data: UpdateProduct!) {
                  ${path}(id: $id, data: $data) {
                      ...ProductFragment
                  }
              }
              ${crwClient?.ProductFragment}
          `,
      variables: {
        id: 2,
        data: updateProduct,
      },
    });
    const success = crwClient?.returnData(res, path);
    if (Array.isArray(success)) {
      console.error('res error', success);
      expect(!Array.isArray(success)).toBeTruthy();
    }
    const data2 = await getProductById(2);
    if (Array.isArray(data2)) {
      console.error('data error', data2);
      expect(!Array.isArray(data2)).toBeTruthy();
    }

    expect(data2).toBeTruthy();
    expect(data2.id).toBeTruthy();
    expect(data2.slug).toBeTruthy();
    expect(data2.slug === '__test__').toBeTruthy();
  });

  it(`createProduct`, async () => {
    const data1: TProduct = await getProductById(3);
    if (Array.isArray(data1)) {
      console.error('data error', data1);
      expect(!Array.isArray(data1)).toBeTruthy();
    }
    expect(data1).toBeTruthy();
    expect(data1.id).toBeTruthy();
    expect(data1.slug).toBeTruthy();

    const path = GraphQLPaths.Product.create;

    const createProduct: TProductInput = {
      slug: '__test3__',
      name: data1.name,
      pageTitle: data1.pageTitle,
      mainImage: data1.mainImage,
      isEnabled: data1.isEnabled,
    };

    const res = await query({
      query: gql`
              mutation testCreatePost($data: CreateProduct!) {
                  ${path}(data: $data) {
                      ...ProductFragment
                  }
              }
              ${crwClient?.ProductFragment}
          `,
      variables: {
        data: createProduct,
      },
    });
    const success = crwClient?.returnData(res, path);
    expect(success).toBeTruthy();
    if (Array.isArray(success)) {
      console.error('res error', success);
      expect(!Array.isArray(success)).toBeTruthy();
    }

    const data2 = await getProductBySlug('__test3__');
    if (Array.isArray(data2)) {
      console.error('data error', data2);
      expect(!Array.isArray(data2)).toBeTruthy();
    }
    expect(data2).toBeTruthy();
    expect(data2.id).toBeTruthy();
    expect(data2.slug).toBeTruthy();
    expect(data2.slug === '__test3__').toBeTruthy();
  });

  it(`deleteProduct`, async () => {
    const data1: TProduct = await getProductById(4);
    if (Array.isArray(data1)) {
      console.error('data error', data1);
      expect(!Array.isArray(data1)).toBeTruthy();
    }
    expect(data1).toBeTruthy();
    expect(data1.id).toBeTruthy();
    expect(data1.slug).toBeTruthy();
    const path = GraphQLPaths.Product.delete;

    const res = await query({
      query: gql`
                mutation testDeleteProduct($id: Int!) {
                    ${path}(id: $id)
                }
          `,
      variables: {
        id: 4,
      },
    });
    const success = crwClient?.returnData(res, path);
    if (Array.isArray(success)) {
      console.error('res error', success);
      expect(!Array.isArray(success)).toBeTruthy();
    }
    expect(success === true).toBeTruthy();

    const data2 = await getProductById(4).catch(() => null);

    expect(!data2?.id).toBeTruthy();
    expect(!data2?.slug).toBeTruthy();
  });

  afterAll(async () => {
    await tearDownResolver(server);
  });
});
