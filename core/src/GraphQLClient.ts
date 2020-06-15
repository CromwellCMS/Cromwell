import { GraphQLClient } from 'graphql-request';
import { Variables as GraphQLVariables } from 'graphql-request/dist/src/types';
import { getStoreItem } from './GlobalStore';
import { CromwellBlockDataType, RestAPIClient } from './types';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApolloClient, ApolloQueryResult, QueryOptions } from 'apollo-client';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';

const cache = new InMemoryCache();

export const getApolloGraphQLClient = (): ApolloClient<NormalizedCacheObject> => {
    const cmsconfig = getStoreItem('cmsconfig');
    if (!cmsconfig || !cmsconfig.apiPort) {
        console.log('cmsconfig', cmsconfig)
        throw new Error('getGraphQLClient !cmsconfig.apiPort');
    }
    const link = new HttpLink({
        uri: `http://localhost:${cmsconfig.apiPort}/api/v1/graphql`
    });
    const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
        cache,
        link
    });
    return client;
}

export const getGraphQLClient = (): GraphQLClient => {
    const cmsconfig = getStoreItem('cmsconfig');
    if (!cmsconfig || !cmsconfig.apiPort) {
        console.log('cmsconfig', cmsconfig)
        throw new Error('getGraphQLClient !cmsconfig.apiPort');
    }
    const graphQLClient = new GraphQLClient(`http://localhost:${cmsconfig.apiPort}/api/v1/graphql`);

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

export const getRestAPIClient = (): RestAPIClient => {
    const cmsconfig = getStoreItem('cmsconfig');
    if (!cmsconfig || !cmsconfig.apiPort) {
        console.log('cmsconfig', cmsconfig);
        throw new Error('getGraphQLClient !cmsconfig.apiPort');
    }
    const baseUrl = `http://localhost:${cmsconfig.apiPort}/api/v1`;
    return {
        get: <T>(route: string, config?: AxiosRequestConfig | undefined): Promise<AxiosResponse<T>> => {
            return axios.get(`${baseUrl}/${route}`, config);
        },
        getUserModifications: async (pageName: string): Promise<CromwellBlockDataType[]> => {
            const res = await axios.get(`${baseUrl}/modifications/${pageName}`);
            return res.data;
        }
    }
}