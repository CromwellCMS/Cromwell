import { GraphQLClient } from 'graphql-request';
import { getStoreItem } from './GlobalStore';

export const getGraphQLClient = (): GraphQLClient => {
    const cmsconfig = getStoreItem('cmsconfig');
    console.log('cmsconfig', cmsconfig);
    return new GraphQLClient(`http://localhost:${
        cmsconfig ? cmsconfig.apiPort : ''}/`);
}