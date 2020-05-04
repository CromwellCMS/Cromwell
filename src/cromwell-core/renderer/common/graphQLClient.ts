import { GraphQLClient } from 'graphql-request';
const config = require('../../cmsconfig.json');
export const graphQLClient = new GraphQLClient(`http://localhost:${config.apiPort}/`)
