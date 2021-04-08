import { apiMainRoute, apiExtensionRoute } from '@cromwell/core';
import { Module } from '@nestjs/common';
import { TypeGraphQLModule } from 'typegraphql-nestjs';

import { loadEnv } from '../helpers/loadEnv';
import { getResolvers } from '../helpers/getResolvers';

const env = loadEnv();
const apiPrefix = env.serverType === 'main' ? apiMainRoute : apiExtensionRoute;

@Module({
    providers: getResolvers(env.serverType),
    imports: [
        TypeGraphQLModule.forRoot({
            cors: true,
            debug: env.envMode === 'dev',
            playground: env.envMode === 'dev',
            validate: false,
            dateScalarMode: "isoDate",
            path: `/${apiPrefix}/graphql`,
        })
    ]
})
export class GraphqlModule { }