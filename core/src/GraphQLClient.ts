import { GraphQLClient } from 'graphql-request';
import { getStoreItem } from './GlobalStore';
import { CromwellBlockDataType, RestAPIClient } from './types';
import axios, { AxiosRequestConfig } from 'axios';

export const getGraphQLClient = (): GraphQLClient => {
    const cmsconfig = getStoreItem('cmsconfig');
    if (!cmsconfig || !cmsconfig.apiPort) {
        console.log('cmsconfig', cmsconfig)
        throw new Error('getGraphQLClient !cmsconfig.apiPort');
    }
    return new GraphQLClient(`http://localhost:${cmsconfig.apiPort}/api/v1/graphql`);
}

export const getRestAPIClient = (): RestAPIClient => {
    const cmsconfig = getStoreItem('cmsconfig');
    if (!cmsconfig || !cmsconfig.apiPort) {
        console.log('cmsconfig', cmsconfig);
        throw new Error('getGraphQLClient !cmsconfig.apiPort');
    }
    return {
        get: <T>(route: string, config?: AxiosRequestConfig | undefined): Promise<T> => {
            return axios.get(`http://localhost:${cmsconfig.apiPort}/api/v1/${route}`, config);
        },
        getUserModifications: async (pageName: string): Promise<CromwellBlockDataType[]> => {
            const blocks = await axios.get(`http://localhost:${cmsconfig.apiPort}/api/v1/modifications/${pageName}`);
            return blocks.data;
        }
    }
}