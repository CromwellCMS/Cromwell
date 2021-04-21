import { Module } from '@nestjs/common';
import { AuthModule } from './auth.module';
import { RestApiModule } from './restapi.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
    imports: [
        RestApiModule,
        AuthModule,
        ThrottlerModule.forRoot({
            ttl: 30,
            limit: 100,
        }),
    ],
})
export class AppModule { }