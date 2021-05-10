jest.mock('@App/helpers/mainFireAction', () => {
    return {
        mainFireAction: () => null,
    }
});

import { closeConnection, connectDatabase } from '@App/helpers/connectDataBase';
import { AppModule } from '@App/modules/app.module';
import { INestApplication } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, } from '@nestjs/testing';

import { mockWorkingDirectory } from './helpers';


export const setupController = async (name: string) => {
    const testDir = await mockWorkingDirectory(name);

    await connectDatabase('plugin');

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

export const tearDownController = async (app: INestApplication) => {
    await app?.close();

    await closeConnection();
    await new Promise(done => setTimeout(done, 100));
}