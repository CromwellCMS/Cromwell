import { apiV1BaseRoute } from '@cromwell/core';
import { Module } from '@nestjs/common';
import { TypeGraphQLModule } from 'typegraphql-nestjs';

import { setEnv } from '../helpers/setEnv';
import { getResolvers } from '../helpers/getResolvers';

const envMode = setEnv();

@Module({
    providers: getResolvers(),
    imports: [
        TypeGraphQLModule.forRoot({
            cors: true,
            debug: envMode === 'dev',
            playground: envMode === 'dev',
            validate: false,
            dateScalarMode: "isoDate",
            path: `/${apiV1BaseRoute}/graphql`,
        })
    ]
})
export class GraphqlModule { }