import { Module } from '@nestjs/common';

import { getControllers, getServices } from '../helpers/getControllers';
import { loadEnv } from '../helpers/loadEnv';

const env = loadEnv();

@Module({
    controllers: getControllers(env.serverType),
    providers: getServices(env.serverType),
})
export class RestApiModule { }