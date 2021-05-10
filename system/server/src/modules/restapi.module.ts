import { Module, DynamicModule } from '@nestjs/common';

import { getControllers, getServices, getExports } from '../helpers/getControllers';
import { loadEnv } from '../helpers/loadEnv';

const env = loadEnv();

@Module({})
export class RestApiModule {
    static async forRoot(): Promise<DynamicModule> {
        return {
            module: RestApiModule,
            controllers: await getControllers(env.serverType, env.envMode === 'dev'),
            providers: await getServices(env.serverType, env.envMode === 'dev'),
            exports: getExports(),
        }
    }
}