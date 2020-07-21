import { TCromwellBlockData, getStoreItem, TPageConfig, TPageInfo, apiV1BaseRoute, TAppConfig } from '@cromwell/core';
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
    constructor(private baseUrl: string) { }

    public get = <T>(route: string, config?: AxiosRequestConfig | undefined): Promise<AxiosResponse<T>> => {
        return axios.get(`${this.baseUrl}/${route}`, config);
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