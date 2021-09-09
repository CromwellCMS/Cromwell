import { INestApplication } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';

import { closeConnection } from '../src/helpers/connect-database';
import { AppModule } from '../src/modules/app.module';
import { setupConnection } from './helpers';

export const setupController = async (name: string) => {
    const testDir = await setupConnection(name);
    const moduleRef = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    const app = moduleRef.createNestApplication<NestFastifyApplication>(
        new FastifyAdapter(),
    );

    const server = app.getHttpServer();
    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    return {
        server,
        app,
        testDir,
        moduleRef,
    }
}

export const tearDownController = async (app: INestApplication, testDir: string) => {
    await app?.close();

    await closeConnection();
    await new Promise(done => setTimeout(done, 100));
    return testDir;
}