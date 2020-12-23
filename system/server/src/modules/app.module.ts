import { apiV1BaseRoute, getStoreItem } from '@cromwell/core';
import { Module } from '@nestjs/common';
import { TypeGraphQLModule } from 'typegraphql-nestjs';

import { GraphqlModule } from './graphql.module';
import { RestApiModule } from './restapi.module';

@Module({
    imports: [
        RestApiModule,
        TypeGraphQLModule.forRootAsync({
            useFactory: async () => {
                const isDevelopmentMode = getStoreItem('environment')?.mode === 'dev';
                return {
                    cors: true,
                    debug: isDevelopmentMode,
                    playground: isDevelopmentMode,
                    validate: false,
                    dateScalarMode: "isoDate",
                    path: `/${apiV1BaseRoute}/graphql`,
                }
            },
        }),
        GraphqlModule,
    ],
})
export class AppModule { }