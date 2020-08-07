import { TCromwellBlockData, getStoreItem, TPageConfig, TPageInfo, apiV1BaseRoute, TAppConfig, TProduct, TPagedList, TCmsConfig, TPagedParams, TProductCategory, TProductInput } from '@cromwell/core';
import { gql, ApolloClient, InMemoryCache, createHttpLink, NormalizedCacheObject, QueryOptions, ApolloQueryResult } from '@apollo/client';


class CGraphQLClient {

    private apolloClient: ApolloClient<NormalizedCacheObject>;

    constructor(private baseUrl: string) {

        const cache = new InMemoryCache();
        const link = createHttpLink({
            uri: this.baseUrl,
        });
        this.apolloClient = new ApolloClient({
            // Provide required constructor fields
            cache: cache,
            link: link,
            name: 'cromwell-core-client',
            version: '1.0',
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


    // <Product>

    public fullProductFragment = gql`
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
        rating
        views
        isEnabled
        categories(pagedParams: {pageSize: 9999}) @include(if: $withCategories) {
            id
            name
            slug
        }
    }
`

    public getProducts = async (pagedParams?: TPagedParams<TProduct>, withCategories?: boolean): Promise<TPagedList<TProduct>> => {
        const res = await this.apolloClient.query({
            query: gql`
                query coreGetProducts($pagedParams: PagedParamsInput!, $withCategories: Boolean!) {
                    products(pagedParams: $pagedParams) {
                        pagedMeta {
                            pageNumber
                            pageSize
                            totalPages
                            totalElements
                        }
                        elements {
                            ...ProductFragment
                        }
                    }
                }
                ${this.fullProductFragment}
            `,
            variables: {
                pagedParams: pagedParams ? pagedParams : {},
                withCategories: withCategories ? withCategories : false
            }
        })
        return res?.data?.products;
    }

    public getProductById = async (productId: number, withCategories?: boolean): Promise<TProduct> => {
        const res = await this.apolloClient.query({
            query: gql`
                query coreGetProductById($productId: String!, $withCategories: Boolean!) {
                    getProductById(id: $productId) {
                        ...ProductFragment
                    }
                }
                ${this.fullProductFragment}
            `,
            variables: {
                productId,
                withCategories: withCategories ? withCategories : false
            }
        });
        return res?.data?.getProductById;
    }

    public getProductBySlug = async (slug: string, withCategories?: boolean): Promise<TProduct> => {
        const res = await this.apolloClient.query({
            query: gql`
                query coreGetProductBySlug($slug: String!, $withCategories: Boolean!) {
                    product(slug: $slug) {
                        ...ProductFragment
                    }
                }
                ${this.fullProductFragment}
            `,
            variables: {
                slug,
                withCategories: withCategories ? withCategories : false
            }
        });
        return res?.data?.product;
    }

    public updateProduct = async (id: string, product: TProductInput, withCategories?: boolean) => {
        const res = await this.apolloClient.mutate({
            mutation: gql`
                mutation coreUpdateProduct($id: String!, $data: UpdateProduct!, $withCategories: Boolean!) {
                    updateProduct(id: $id, data: $data) {
                        ...ProductFragment
                    }
                }
                ${this.fullProductFragment}
            `,
            variables: {
                id,
                data: product,
                withCategories: withCategories ? withCategories : false
            }
        });
        return res?.data?.updateProduct;
    }

    // </Product>

    // <ProductCategory>

    public getProductCategoryBySlug = async (slug: string, productsPagedParams?: TPagedParams<TProduct>): Promise<TProductCategory> => {
        const res = await this.apolloClient.query({
            query: gql`
                query coreGetProductCategory($slug: String!, $productsPagedParams: PagedParamsInput!, $withCategories: Boolean!) {
                    productCategory(slug: $slug) {
                        id
                        name
                        products(pagedParams: $productsPagedParams) {
                            pagedMeta {
                                pageNumber
                                pageSize
                                totalPages
                                totalElements
                            }
                            elements {
                                ...ProductFragment
                            }
                        }
                    }
                }
                ${this.fullProductFragment}
            `,
            variables: {
                slug,
                productsPagedParams: productsPagedParams ? productsPagedParams : {},
                withCategories: false
            }
        });

        return res?.data?.productCategory;
    }


    // </ProductCategory>


}

export const getGraphQLClient = (): CGraphQLClient => {
    const cmsconfig = getStoreItem('cmsconfig');
    if (!cmsconfig || !cmsconfig.apiPort) {
        console.log('cmsconfig', cmsconfig)
        throw new Error('getGraphQLClient !cmsconfig.apiPort');
    }
    const baseUrl = `http://localhost:${cmsconfig.apiPort}/${apiV1BaseRoute}/graphql`;

    return new CGraphQLClient(baseUrl);
}