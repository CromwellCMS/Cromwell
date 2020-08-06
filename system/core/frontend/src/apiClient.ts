import { TCromwellBlockData, getStoreItem, TPageConfig, TPageInfo, apiV1BaseRoute, TAppConfig, TProduct, TPagedList, TCmsConfig, TPagedParams, TProductCategory } from '@cromwell/core';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
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
            version: '1.3',
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


    public getProducts = async (pagedParams?: TPagedParams<TProduct>): Promise<TPagedList<TProduct>> => {
        const res = await this.apolloClient.query({
            query: gql`
                query coreGetProducts($pagedParams: PagedParamsInput!) {
                    products(pagedParams: $pagedParams) {
                        pagedMeta {
                            pageNumber
                            pageSize
                            totalPages
                            totalElements
                        }
                        elements {
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
                        }
                    }
                }
            `,
            variables: {
                pagedParams: pagedParams ? pagedParams : {}
            }
        })
        return res?.data?.products;
    }

    public getProductById = async (productId: number, withCategories?: boolean): Promise<TProduct> => {
        const res = await this.apolloClient.query({
            query: gql`
                query coreGetProductById($productId: String!, $withCategories: Boolean!) {
                    getProductById(id: $productId) {
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
                }
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
                }
            `,
            variables: {
                slug,
                withCategories: withCategories ? withCategories : false
            }
        });
        return res?.data?.product;
    }

    public getProductCategoryBySlug = async (slug: string, productsPagedParams?: TPagedParams<TProduct>): Promise<TProductCategory> => {
        const res = await this.apolloClient.query({
            query: gql`
                query coreGetProductCategory($slug: String!, $productsPagedParams: PagedParamsInput!) {
                    productCategory(slug: $slug) {
                        id
                        name
                        products(pagedParams: $productsPagedParams) {
                            id
                            slug
                            name
                            pageTitle
                            price
                            oldPrice
                            mainImage
                        }
                    }
                }
            `,
            variables: {
                slug,
                productsPagedParams: productsPagedParams ? productsPagedParams : {}
            }
        });

        return res?.data?.productCategory;
    }
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

class RestAPIClient {
    constructor(private baseUrl: string) { }

    public get = <T>(route: string, config?: AxiosRequestConfig | undefined): Promise<AxiosResponse<T>> => {
        return axios.get(`${this.baseUrl}/${route}`, config);
    }

    public getCmsConfig = async (): Promise<TCmsConfig> => {
        let res: any;
        try {
            res = await axios.get(`${this.baseUrl}/cms/config`);
        } catch (e) { console.error('RestAPIClient::getCmsConfig', e) }
        return res?.data;
    }

    public getPageConfig = async (pageRoute: string): Promise<TPageConfig> => {
        let res: any;
        try {
            res = await axios.get(`${this.baseUrl}/theme/page/?pageRoute=${pageRoute}`);
        } catch (e) { console.error('RestAPIClient::getPageConfig', e) }
        return (res && res.data) ? res.data : [];
    }

    public getPluginsModifications = async (pageRoute: string): Promise<Record<string, any>> => {
        let res: any;
        try {
            res = await axios.get(`${this.baseUrl}/theme/plugins?pageRoute=${pageRoute}`);
        } catch (e) { console.error('RestAPIClient::getPluginsModifications', e) }
        return (res && res.data) ? res.data : {};
    }

    public getPluginNames = async (): Promise<string[]> => {
        let res: any;
        try {
            res = await axios.get(`${this.baseUrl}/theme/pluginNames`);
        } catch (e) { console.error('RestAPIClient::getPluginNames', e) }
        return (res && res.data) ? res.data : [];
    }

    public getPagesInfo = async (): Promise<TPageInfo[]> => {
        let res: any;
        try {
            res = await axios.get(`${this.baseUrl}/theme/pages/info`);
        } catch (e) { console.error('RestAPIClient::getPagesInfo', e) }
        return (res && res.data) ? res.data : [];
    }

    public getPageConfigs = async (): Promise<TPageConfig[]> => {
        let res: any;
        try {
            res = await axios.get(`${this.baseUrl}/theme/pages/configs`);
        } catch (e) { console.error('RestAPIClient::getPageConfigs', e) }
        return (res && res.data) ? res.data : [];
    }

    public getAppConfig = async (): Promise<TAppConfig> => {
        let res: any;
        try {
            res = await axios.get(`${this.baseUrl}/theme/app/config`);
        } catch (e) { console.error('RestAPIClient::getAppConfig', e) }
        return (res && res.data) ? res.data : {};
    }

    public getAppCustomConfig = async (): Promise<Record<string, any>> => {
        let res: any;
        try {
            res = await axios.get(`${this.baseUrl}/theme/app/custom-config`);
        } catch (e) { console.error('RestAPIClient::getAppCustomConfig', e) }
        return (res && res.data) ? res.data : {};
    }

    public getPluginSettings = async (pluginName: string): Promise<any | null> => {
        let res: any;
        try {
            res = await axios.get(`${this.baseUrl}/plugin/settings/${pluginName}`);
        } catch (e) { console.error('RestAPIClient::getPluginSettings', e) }
        return (res && res.data) ? res.data : null;
    }

    public setPluginSettings = async (pluginName: string, settings: any): Promise<boolean> => {
        let res: any;
        try {
            res = await axios.post(`${this.baseUrl}/plugin/settings/${pluginName}`, settings);
        } catch (e) { console.error('RestAPIClient::setPluginSettings', e) }
        return (res && res.data) ? res.data : null;
    }
}

export const getRestAPIClient = (): RestAPIClient => {
    const cmsconfig = getStoreItem('cmsconfig');
    if (!cmsconfig || !cmsconfig.apiPort) {
        console.log('cmsconfig', cmsconfig);
        throw new Error('getGraphQLClient !cmsconfig.apiPort');
    }
    const baseUrl = `http://localhost:${cmsconfig.apiPort}/${apiV1BaseRoute}`;
    return new RestAPIClient(baseUrl);
}