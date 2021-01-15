import { Module } from '@nestjs/common';

import { GraphqlModule } from './graphql.module';
import { RestApiModule } from './restapi.module';
import { AuthModule } from './auth.module';

@Module({
    imports: [
        RestApiModule,
        GraphqlModule,
        AuthModule
    ],
})
export class AppModule { }