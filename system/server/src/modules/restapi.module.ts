import { DynamicModule, Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

import { AuthInterceptor } from '../filters/auth.interceptor';
import { getControllers, getExports, getServices } from '../helpers/get-controllers';
import { loadEnv } from '../helpers/settings';

@Module({})
export class RestApiModule {
  static async forRoot(): Promise<DynamicModule> {
    return {
      module: RestApiModule,
      controllers: await getControllers(loadEnv().envMode === 'dev'),
      providers: [
        ...(await getServices(loadEnv().envMode === 'dev')),
        {
          provide: APP_INTERCEPTOR,
          useClass: AuthInterceptor,
        },
        {
          provide: APP_GUARD,
          useClass: ThrottlerGuard,
        },
      ],
      exports: getExports(),
    };
  }
}
