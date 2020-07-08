import { CromwellBlockDataType, getStoreItem, PageConfigType, PageInfoType, apiV1BaseRoute } from '@cromwell/core';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { GraphQLClient } from 'graphql-request';

// import { Variables as GraphQLVariables } from 'graphql-request/dist/src/types';
// import { ApolloClient, ApolloQueryResult, QueryOptions } from 'apollo-client';
// import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
// import { HttpLink } from 'apollo-link-http';

// const cache = new InMemoryCache();

// export const getApolloGraphQLClient = (): ApolloClient<NormalizedCacheObject> => {
//     const cmsconfig = getStoreItem('cmsconfig');
//     if (!cmsconfig || !cmsconfig.apiPort) {
//         console.log('cmsconfig', cmsconfig)
//         throw new Error('getGraphQLClient !cmsconfig.apiPort');
//     }
//     const link = new HttpLink({
//         uri: `http://localhost:${cmsconfig.apiPort}/api/v1/graphql`
//     });
//     const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
//         cache,
//         link
//     });
//     return client;
// }

export const getGraphQLClient = (): GraphQLClient => {
    const cmsconfig = getStoreItem('cmsconfig');
    if (!cmsconfig || !cmsconfig.apiPort) {
        console.log('cmsconfig', cmsconfig)
        throw new Error('getGraphQLClient !cmsconfig.apiPort');
    }
    const graphQLClient = new GraphQLClient(`http://localhost:${cmsconfig.apiPort}/${apiV1BaseRoute}/graphql`);

    // const graphQLClientRequestOrig = graphQLClient.request;
    // async function graphQLClientRequest<T extends any>(query: string, variables: GraphQLVariables = {}): Promise<T> {
    //     const data: any = await graphQLClientRequestOrig.call(graphQLClient, query, {
    //         ...variables,
    //         someVar: 'someVar'
    //     });
    //     return data;
    // }
    // graphQLClient.request = graphQLClientRequest;
    return graphQLClient;
}

class RestAPIClient {
    private baseUrl: string;

    constructor() {
        const cmsconfig = getStoreItem('cmsconfig');
        if (!cmsconfig || !cmsconfig.apiPort) {
            console.log('cmsconfig', cmsconfig);
            throw new Error('getGraphQLClient !cmsconfig.apiPort');
        }
        this.baseUrl = `http://localhost:${cmsconfig.apiPort}/${apiV1BaseRoute}`;
    }

    public get = <T>(route: string, config?: AxiosRequestConfig | undefined): Promise<AxiosResponse<T>> => {
        return axios.get(`${this.baseUrl}/${route}`, config);
    }

    public getThemeModifications = async (pageRoute: string): Promise<CromwellBlockDataType[]> => {
        let res: any;
        try {
            res = await axios.get(`${this.baseUrl}/modifications/page/?pageRoute=${pageRoute}`);
        } catch (e) { console.error('RestAPIClient::getThemeModifications', e) }
        return (res && res.data) ? res.data : [];
    }

    public getPluginsModifications = async (pageRoute: string): Promise<Record<string, any>> => {
        let res: any;
        try {
            res = await axios.get(`${this.baseUrl}/modifications/plugins?pageRoute=${pageRoute}`);
        } catch (e) { console.error('RestAPIClient::getPluginsModifications', e) }
        return (res && res.data) ? res.data : {};
    }

    public getPluginNames = async (): Promise<string[]> => {
        let res: any;
        try {
            res = await axios.get(`${this.baseUrl}/modifications/pluginNames`);
        } catch (e) { console.error('RestAPIClient::getPluginNames', e) }
        return (res && res.data) ? res.data : [];
    }

    public getPagesInfo = async (): Promise<PageInfoType[]> => {
        let res: any;
        try {
            res = await axios.get(`${this.baseUrl}/modifications/pages/info`);
        } catch (e) { console.error('RestAPIClient::getPagesInfo', e) }
        return (res && res.data) ? res.data : [];
    }

    public getPageConfigs = async (): Promise<PageConfigType[]> => {
        let res: any;
        try {
            res = await axios.get(`${this.baseUrl}/modifications/pages/configs`);
        } catch (e) { console.error('RestAPIClient::getPagesInfo', e) }
        return (res && res.data) ? res.data : [];
    }
}

export const getRestAPIClient = (): RestAPIClient => {
    return new RestAPIClient();
}