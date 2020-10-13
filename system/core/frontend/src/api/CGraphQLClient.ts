import {
    ApolloClient,
    ApolloQueryResult,
    createHttpLink,
    gql,
    InMemoryCache,
    NormalizedCacheObject,
    QueryOptions,
} from '@apollo/client';
import {
    apiV1BaseRoute,
    getStoreItem,
    GraphQLPaths,
    serviceLocator,
    setStoreItem,
    TAttribute,
    TAttributeInput,
    TPagedList,
    TPagedParams,
    TProduct,
    TProductCategory,
    TProductInput,
    TProductReview,
    TProductReviewInput,
} from '@cromwell/core';

class CGraphQLClient {

    public readonly apolloClient: ApolloClient<NormalizedCacheObject>;

    constructor(private baseUrl: string) {

        const cache = new InMemoryCache();
        const link = createHttpLink({
            uri: this.baseUrl,
        });
        this.apolloClient = new ApolloClient({
            cache: cache,
            link: link,
            name: 'cromwell-core-client',
            queryDeduplication: false,
            defaultOptions: {
                query: {
                    fetchPolicy: 'network-only',
                },
                watchQuery: {
                    fetchPolicy: 'cache-and-network',
                },
            },
        });
    }

    public query = <T = any>(options: QueryOptions): Promise<ApolloQueryResult<T>> =>
        this.apolloClient.query(options);

    public returnData = (res: any, path: string) => res?.data ? res?.data[path] : undefined;

    public PagedMetaFragment = gql`
        fragment PagedMetaFragment on PagedMeta {
            pageNumber
            pageSize
            totalPages
            totalElements
        }
    `

    // <Product>

    public ProductFragment = gql`
        fragment ProductFragment on Product {
            id
            slug
            pageTitle
            name
            price
            oldPrice
            mainImage
            images
            description
            views
            rating {
                average
                reviewsNumber
            }
            attributes {
                key
                values {
                    value
                    productVariant {
                        name
                        price
                        oldPrice
                        mainImage
                        images
                        description
                    }
                }
            }
            isEnabled
            categories(pagedParams: {pageSize: 9999}) @include(if: $withCategories) {
                id
                name
                slug
            }
        }
    `

    public getProducts = async (pagedParams?: TPagedParams<TProduct>, withCategories: boolean = false): Promise<TPagedList<TProduct>> => {
        const path = GraphQLPaths.Product.getMany;
        const res = await this.apolloClient.query({
            query: gql`
                query coreGetProducts($pagedParams: PagedParamsInput!, $withCategories: Boolean!) {
                    ${path}(pagedParams: $pagedParams) {
                        pagedMeta {
                            ...PagedMetaFragment
                        }
                        elements {
                            ...ProductFragment
                        }
                    }
                }
                ${this.ProductFragment}
                ${this.PagedMetaFragment}
            `,
            variables: {
                pagedParams: pagedParams ? pagedParams : {},
                withCategories
            }
        })
        return this.returnData(res, path);
    }

    public getProductById = async (productId: string, withCategories: boolean = false)
        : Promise<TProduct | undefined> => {
        const path = GraphQLPaths.Product.getOneById;
        const res = await this.apolloClient.query({
            query: gql`
                query coreGetProductById($productId: String!, $withCategories: Boolean!) {
                    ${path}(id: $productId) {
                        ...ProductFragment
                    }
                }
                ${this.ProductFragment}
            `,
            variables: {
                productId,
                withCategories
            }
        });
        return this.returnData(res, path);
    }

    public getProductBySlug = async (slug: string, withCategories: boolean = false): Promise<TProduct | undefined> => {
        const path = GraphQLPaths.Product.getOneBySlug;
        const res = await this.apolloClient.query({
            query: gql`
                query coreGetProductBySlug($slug: String!, $withCategories: Boolean!) {
                    ${path}(slug: $slug) {
                        ...ProductFragment
                    }
                }
                ${this.ProductFragment}
            `,
            variables: {
                slug,
                withCategories
            }
        });
        return this.returnData(res, path);
    }

    public updateProduct = async (id: string, product: TProductInput, withCategories: boolean = false) => {
        const path = GraphQLPaths.Product.update;
        const res = await this.apolloClient.mutate({
            mutation: gql`
                mutation coreUpdateProduct($id: String!, $data: UpdateProduct!, $withCategories: Boolean!) {
                    ${path}(id: $id, data: $data) {
                        ...ProductFragment
                    }
                }
                ${this.ProductFragment}
            `,
            variables: {
                id,
                data: product,
                withCategories
            }
        });
        return this.returnData(res, path);
    }

    public createProduct = async (product: TProductInput, withCategories: boolean = false) => {
        const path = GraphQLPaths.Product.create;
        const res = await this.apolloClient.mutate({
            mutation: gql`
                mutation coreCreateProduct($data: CreateProduct!, $withCategories: Boolean!) {
                    ${path}(id: $id, data: $data) {
                        ...ProductFragment
                    }
                }
                ${this.ProductFragment}
            `,
            variables: {
                data: product,
                withCategories: withCategories
            }
        });
        return this.returnData(res, path);
    }

    public getProductsFromCategory = async (categoryId: string, pagedParams?: TPagedParams<TProduct>, withCategories: boolean = false): Promise<TPagedList<TProduct>> => {
        const path = GraphQLPaths.Product.getFromCategory;
        const res = await this.apolloClient.query({
            query: gql`
                query coreGetProductsFromCategory($categoryId: String!, $pagedParams: PagedParamsInput!, $withCategories: Boolean!) {
                    ${path}(categoryId: $categoryId, pagedParams: $pagedParams) {
                        pagedMeta {
                            ...PagedMetaFragment
                        }
                        elements {
                            ...ProductFragment
                        }
                    }
                }
                ${this.ProductFragment}
                ${this.PagedMetaFragment}
            `,
            variables: {
                withCategories,
                pagedParams: pagedParams ? pagedParams : {},
                categoryId
            }
        })
        return this.returnData(res, path);
    }

    // </Product>


    // <ProductCategory>

    public getProductCategoryBySlug = async (slug: string, productsPagedParams?: TPagedParams<TProduct>): Promise<TProductCategory | undefined> => {
        const path = GraphQLPaths.ProductCategory.getOneBySlug;
        const res = await this.apolloClient.query({
            query: gql`
                query coreGetProductCategory($slug: String!, $productsPagedParams: PagedParamsInput!, $withCategories: Boolean!) {
                    ${path}(slug: $slug) {
                        id
                        name
                        products(pagedParams: $productsPagedParams) {
                            pagedMeta {
                                ...PagedMetaFragment
                            }
                            elements {
                                ...ProductFragment
                            }
                        }
                    }
                }
                ${this.ProductFragment}
                ${this.PagedMetaFragment}
            `,
            variables: {
                slug,
                productsPagedParams: productsPagedParams ? productsPagedParams : {},
                withCategories: false
            }
        });

        return this.returnData(res, path);
    }

    // </ProductCategory>


    // <Attribute>

    public AttributeFragment = gql`
       fragment AttributeFragment on Attribute {
            id
            key
            values {
                value
                icon
            }
            type
            isEnabled
       }
   `

    public getAttributes = async (): Promise<TAttribute[] | undefined> => {
        const path = GraphQLPaths.Attribute.getMany;
        const res = await this.apolloClient.query({
            query: gql`
                query coreGetAttributes {
                    ${path} {
                        ...AttributeFragment
                    }
                }
                ${this.AttributeFragment}
           `
        })
        return this.returnData(res, path);
    }

    public getAttributeById = async (attributeId: string): Promise<TAttribute | undefined> => {
        const path = GraphQLPaths.Attribute.getOneById;
        const res = await this.apolloClient.query({
            query: gql`
               query coreGetAttributeById($attributeId: String!) {
                ${path}(id: $attributeId) {
                       ...AttributeFragment
                    }           
               }
               ${this.AttributeFragment}
           `,
            variables: {
                attributeId
            }
        });
        return this.returnData(res, path);
    }

    public updateAttribute = async (id: string, attribute: TAttributeInput) => {
        const path = GraphQLPaths.Attribute.update;
        const res = await this.apolloClient.mutate({
            mutation: gql`
               mutation coreUpdateAttribute($id: String!, $data: AttributeInput!) {
                ${path}(id: $id, data: $data) {
                       ...AttributeFragment
                   }
               }
               ${this.AttributeFragment}
           `,
            variables: {
                id,
                data: attribute,
            }
        });
        return this.returnData(res, path);
    }

    public createAttribute = async (attribute: TAttributeInput) => {
        const path = GraphQLPaths.Attribute.create;
        const res = await this.apolloClient.mutate({
            mutation: gql`
               mutation coreCreateAttribute($data: AttributeInput!) {
                ${path}(data: $data) {
                       ...AttributeFragment
                   }
               }
               ${this.AttributeFragment}
           `,
            variables: {
                data: attribute,
            }
        });
        return this.returnData(res, path);
    }


    // </Attribute>


    // <ProductReview>

    public ProductReviewFragment = gql`
        fragment ProductReviewFragment on ProductReview {
            id
            productId
            title
            description
            rating
            userName
            isEnabled
        }
  `

    public getProductReview = async (productReviewId: string): Promise<TProductReview | undefined> => {
        const path = GraphQLPaths.ProductReview.getOneById;
        const res = await this.apolloClient.query({
            query: gql`
              query coreGetProductReviewById($id: String!) {
                ${path}(id: $id) {
                      ...ProductReviewFragment
                   }           
              }
              ${this.ProductReviewFragment}
          `,
            variables: {
                id: productReviewId
            }
        });
        return this.returnData(res, path);
    }

    public getProductReviews = async (pagedParams?: TPagedParams<TProductReview>): Promise<TPagedList<TProductReview>> => {
        const path = GraphQLPaths.ProductReview.getMany;
        const res = await this.apolloClient.query({
            query: gql`
                query coreGetProductReviews($pagedParams: PagedParamsInput!) {
                    ${path}(pagedParams: $pagedParams) {
                        pagedMeta {
                            ...PagedMetaFragment
                        }
                        elements {
                            ...ProductReviewFragment
                        }
                    }
                }
                ${this.ProductReviewFragment}
                ${this.PagedMetaFragment}
            `,
            variables: {
                pagedParams: pagedParams ? pagedParams : {},
            }
        })
        return this.returnData(res, path);
    }

    public getProductReviewsOfProduct = async (productId: string, pagedParams?: TPagedParams<TProductReview>): Promise<TPagedList<TProductReview>> => {
        const path = GraphQLPaths.ProductReview.getFromProduct;
        const res = await this.apolloClient.query({
            query: gql`
                query coreGetProductReviewsOfProduct($productId: String!, $pagedParams: PagedParamsInput!) {
                    ${path}(productId: $productId, pagedParams: $pagedParams) {
                        pagedMeta {
                            ...PagedMetaFragment
                        }
                        elements {
                            ...ProductReviewFragment
                        }
                    }
                }
                ${this.ProductReviewFragment}
                ${this.PagedMetaFragment}
            `,
            variables: {
                productId,
                pagedParams: pagedParams ? pagedParams : {},
            }
        })
        return this.returnData(res, path);
    }


    public updateProductReview = async (id: string, productReview: TProductReviewInput): Promise<TProductReview | undefined> => {
        const path = GraphQLPaths.ProductReview.update;
        const res = await this.apolloClient.mutate({
            mutation: gql`
              mutation coreUpdateAttribute($id: String!, $data: AttributeInput!) {
                ${path}(id: $id, data: $data) {
                      ...ProductReviewFragment
                  }
              }
              ${this.ProductReviewFragment}
          `,
            variables: {
                id,
                data: productReview,
            }
        });
        return this.returnData(res, path);
    }

    public createProductReview = async (productReview: TProductReviewInput): Promise<TProductReview | undefined> => {
        const path = GraphQLPaths.ProductReview.create;
        const res = await this.apolloClient.mutate({
            mutation: gql`
              mutation coreCreateProductReview($data: AttributeInput!) {
                ${path}(data: $data) {
                      ...ProductReviewFragment
                  }
              }
              ${this.ProductReviewFragment}
          `,
            variables: {
                data: productReview,
            }
        });
        return this.returnData(res, path);
    }


    // </ProductReview>


}

export type TCGraphQLClient = CGraphQLClient;

export const getGraphQLClient = (): CGraphQLClient | undefined => {
    let client = getStoreItem('graphQLClient');
    if (client) return client;

    const baseUrl = `${serviceLocator.getApiUrl()}/${apiV1BaseRoute}/graphql`;

    client = new CGraphQLClient(baseUrl);
    setStoreItem('graphQLClient', client);
    return client;
}