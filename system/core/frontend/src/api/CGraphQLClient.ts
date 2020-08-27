import {
    TCromwellBlockData, getStoreItem, TPageConfig, TPageInfo, apiV1BaseRoute,
    TAppConfig, TProduct, TPagedList, TCmsConfig, TPagedParams, TProductCategory,
    TProductInput, TAttribute, setStoreItem, TProductReviewInput, TAttributeInput, TProductReview
} from '@cromwell/core';
import {
    gql, ApolloClient, InMemoryCache, createHttpLink, NormalizedCacheObject,
    QueryOptions, ApolloQueryResult
} from '@apollo/client';

class CGraphQLClient {

    private apolloClient: ApolloClient<NormalizedCacheObject>;

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
                watchQuery: {
                    fetchPolicy: 'cache-and-network',
                },
            },
        });
    }

    public query = <T = any>(options: QueryOptions): Promise<ApolloQueryResult<T>> =>
        this.apolloClient.query(options);


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
            rating
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
        const res = await this.apolloClient.query({
            query: gql`
                query coreGetProducts($pagedParams: PagedParamsInput!, $withCategories: Boolean!) {
                    products(pagedParams: $pagedParams) {
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
        return res?.data?.products;
    }

    public getProductById = async (productId: string, withCategories: boolean = false): Promise<TProduct | undefined> => {
        const res = await this.apolloClient.query({
            query: gql`
                query coreGetProductById($productId: String!, $withCategories: Boolean!) {
                    getProductById(id: $productId) {
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
        return res?.data?.getProductById;
    }

    public getProductBySlug = async (slug: string, withCategories: boolean = false): Promise<TProduct | undefined> => {
        const res = await this.apolloClient.query({
            query: gql`
                query coreGetProductBySlug($slug: String!, $withCategories: Boolean!) {
                    product(slug: $slug) {
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
        return res?.data?.product;
    }

    public updateProduct = async (id: string, product: TProductInput, withCategories: boolean = false) => {
        const res = await this.apolloClient.mutate({
            mutation: gql`
                mutation coreUpdateProduct($id: String!, $data: UpdateProduct!, $withCategories: Boolean!) {
                    updateProduct(id: $id, data: $data) {
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
        return res?.data?.updateProduct;
    }

    public createProduct = async (product: TProductInput, withCategories: boolean = false) => {
        const res = await this.apolloClient.mutate({
            mutation: gql`
                mutation coreCreateProduct($data: CreateProduct!, $withCategories: Boolean!) {
                    createProduct(id: $id, data: $data) {
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
        return res?.data?.createProduct;
    }


    // </Product>

    // <ProductCategory>

    public getProductCategoryBySlug = async (slug: string, productsPagedParams?: TPagedParams<TProduct>): Promise<TProductCategory | undefined> => {
        const res = await this.apolloClient.query({
            query: gql`
                query coreGetProductCategory($slug: String!, $productsPagedParams: PagedParamsInput!, $withCategories: Boolean!) {
                    productCategory(slug: $slug) {
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

        return res?.data?.productCategory;
    }

    public getProductsFromCategory = async (categoryId: string, pagedParams?: TPagedParams<TProduct>, withCategories: boolean = false): Promise<TPagedList<TProduct>> => {
        const res = await this.apolloClient.query({
            query: gql`
                query coreGetProductsFromCategory($categoryId: String!, $pagedParams: PagedParamsInput!, $withCategories: Boolean!) {
                    getProductsFromCategory(categoryId: $categoryId, pagedParams: $pagedParams) {
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
        return res?.data?.getProductsFromCategory;
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
        const res = await this.apolloClient.query({
            query: gql`
               query coreGetAttributes {
                    attributes {
                        ...AttributeFragment
                    }
               }
               ${this.AttributeFragment}
           `
        })
        return res?.data?.attributes;
    }

    public getAttributeById = async (attributeId: string): Promise<TAttribute | undefined> => {
        const res = await this.apolloClient.query({
            query: gql`
               query coreGetAttributeById($attributeId: String!) {
                    getAttribute(id: $attributeId) {
                       ...AttributeFragment
                    }           
               }
               ${this.AttributeFragment}
           `,
            variables: {
                attributeId
            }
        });
        return res?.data?.getAttribute;
    }

    public updateAttribute = async (id: string, attribute: TAttributeInput) => {
        const res = await this.apolloClient.mutate({
            mutation: gql`
               mutation coreUpdateAttribute($id: String!, $data: AttributeInput!) {
                    updateAttribute(id: $id, data: $data) {
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
        return res?.data?.updateAttribute;
    }

    public createAttribute = async (attribute: TAttributeInput) => {
        const res = await this.apolloClient.mutate({
            mutation: gql`
               mutation coreCreateAttribute($data: AttributeInput!) {
                   createAttribute(data: $data) {
                       ...AttributeFragment
                   }
               }
               ${this.AttributeFragment}
           `,
            variables: {
                data: attribute,
            }
        });
        return res?.data?.createAttribute;
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
        const res = await this.apolloClient.query({
            query: gql`
              query coreGetProductReviewById($id: String!) {
                productReview(id: $id) {
                      ...ProductReviewFragment
                   }           
              }
              ${this.ProductReviewFragment}
          `,
            variables: {
                id: productReviewId
            }
        });
        return res?.data?.productReview;
    }

    public getProductReviews = async (pagedParams?: TPagedParams<TProductReview>): Promise<TPagedList<TProductReview>> => {
        const res = await this.apolloClient.query({
            query: gql`
                query coreGetProductReviews($pagedParams: PagedParamsInput!) {
                    productReviews(pagedParams: $pagedParams) {
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
        return res?.data?.productReviews;
    }

    public getProductReviewsOfProduct = async (productId: string, pagedParams?: TPagedParams<TProductReview>): Promise<TPagedList<TProductReview>> => {
        const res = await this.apolloClient.query({
            query: gql`
                query coreGetProductReviewsOfProduct($productId: String!, $pagedParams: PagedParamsInput!) {
                    getProductReviewsOfProduct(productId: $productId, pagedParams: $pagedParams) {
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
        return res?.data?.getProductReviewsOfProduct;
    }


    public updateProductReview = async (id: string, productReview: TProductReviewInput): Promise<TProductReview | undefined> => {
        const res = await this.apolloClient.mutate({
            mutation: gql`
              mutation coreUpdateAttribute($id: String!, $data: AttributeInput!) {
                  updateProductReview(id: $id, data: $data) {
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
        return res?.data?.updateProductReview;
    }

    public createProductReview = async (productReview: TProductReviewInput): Promise<TProductReview | undefined> => {
        const res = await this.apolloClient.mutate({
            mutation: gql`
              mutation coreCreateProductReview($data: AttributeInput!) {
                createProductReview(data: $data) {
                      ...ProductReviewFragment
                  }
              }
              ${this.ProductReviewFragment}
          `,
            variables: {
                data: productReview,
            }
        });
        return res?.data?.createProductReview;
    }


    // </ProductReview>


}

export type TCGraphQLClient = CGraphQLClient;

export const getGraphQLClient = (): CGraphQLClient | undefined => {
    let client = getStoreItem('graphQLClient');
    if (client) return client;

    const cmsconfig = getStoreItem('cmsconfig');
    if (!cmsconfig || !cmsconfig.apiPort) {
        console.error('getGraphQLClient !cmsconfig.apiPort, cmsconfig:', cmsconfig);
        return;
    }
    const baseUrl = `http://localhost:${cmsconfig.apiPort}/${apiV1BaseRoute}/graphql`;

    client = new CGraphQLClient(baseUrl);
    setStoreItem('graphQLClient', client);
    return client;
}