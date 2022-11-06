import { DynamicModule, Module } from '@nestjs/common';

import { getControllers, getExports, getServices } from '../helpers/get-controllers';
import { loadEnv } from '../helpers/settings';

@Module({})
export class RestApiModule {
  static async forRoot(): Promise<DynamicModule> {
    return {
      module: RestApiModule,
      controllers: await getControllers(loadEnv().envMode === 'dev'),
      providers: await getServices(loadEnv().envMode === 'dev'),
      exports: getExports(),
    };
  }
}
