import { Module } from '@nestjs/common';
import { RestApiModule } from './restapi.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    RestApiModule.forRoot(),
    ThrottlerModule.forRoot({
      ttl: 30,
      limit: 100,
    }),
  ],
})
export class AppModule {}
