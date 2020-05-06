import { GraphQLClient } from 'graphql-request';
export const config = require('../cmsconfig.json');
export const graphQLClient = new GraphQLClient(`http://localhost:${config.apiPort}/`);