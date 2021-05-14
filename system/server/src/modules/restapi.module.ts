import { DynamicModule, Module } from '@nestjs/common';

import { getControllers, getExports, getServices } from '../helpers/getControllers';

@Module({})
export class RestApiModule {
    static async forRoot(): Promise<DynamicModule> {
        return {
            module: RestApiModule,
            controllers: await getControllers(),
            providers: await getServices(),
            exports: getExports(),
        }
    }
}