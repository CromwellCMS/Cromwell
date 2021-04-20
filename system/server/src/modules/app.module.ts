import { Module } from '@nestjs/common';

import { AuthModule } from './auth.module';
import { RestApiModule } from './restapi.module';

@Module({
    imports: [
        RestApiModule,
        AuthModule,
    ],
})
export class AppModule { }