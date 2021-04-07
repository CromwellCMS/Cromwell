import { apiV1BaseRoute } from '@cromwell/core';
import { Module } from '@nestjs/common';
import { TypeGraphQLModule } from 'typegraphql-nestjs';

import { loadEnv } from '../helpers/loadEnv';
import { getResolvers } from '../helpers/getResolvers';

const env = loadEnv();

@Module({
    providers: getResolvers(env.serverType),
    imports: [
        TypeGraphQLModule.forRoot({
            cors: true,
            debug: env.envMode === 'dev',
            playground: env.envMode === 'dev',
            validate: false,
            dateScalarMode: "isoDate",
            path: `/${apiV1BaseRoute}/graphql`,
        })
    ]
})
export class GraphqlModule { }