import { Module } from '@nestjs/common';

import { GraphqlModule } from './graphql.module';
import { RestApiModule } from './restapi.module';

@Module({
    imports: [
        RestApiModule,
        GraphqlModule
    ],
})
export class AppModule { }