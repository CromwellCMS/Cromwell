import { Module } from '@nestjs/common';

import { getControllers, getServices } from '../helpers/getControllers';
import { loadEnv } from '../helpers/loadEnv';

const env = loadEnv();

@Module({
    controllers: getControllers(env.serverType, env.envMode === 'dev'),
    providers: getServices(env.serverType, env.envMode === 'dev'),
})
export class RestApiModule { }