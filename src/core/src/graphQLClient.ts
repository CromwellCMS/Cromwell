import { GraphQLClient } from 'graphql-request';
import { getStoreItem } from './GlobalStore';

export const getGraphQLClient = (): GraphQLClient => {
    const cmsconfig = getStoreItem('cmsconfig');
    if (!cmsconfig || !cmsconfig.apiPort) {
        console.log('cmsconfig', cmsconfig)
        throw new Error('getGraphQLClient !cmsconfig.apiPort');
    }
    return new GraphQLClient(`http://localhost:${cmsconfig.apiPort}/`);
}