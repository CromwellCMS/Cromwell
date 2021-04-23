import { Module } from '@nestjs/common';

import { getControllers, getServices, getExports } from '../helpers/getControllers';
import { loadEnv } from '../helpers/loadEnv';

const env = loadEnv();

@Module({
    controllers: getControllers(env.serverType, env.envMode === 'dev'),
    providers: getServices(env.serverType, env.envMode === 'dev'),
    exports: getExports(env.serverType),
})
export class RestApiModule { }