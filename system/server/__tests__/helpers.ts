import { getServerTempDir } from '@cromwell/core-backend';
import * as coreBackend from '@cromwell/core-backend';
import { INestApplication } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { join } from 'path';

import { closeConnection, connectDatabase } from '../src/helpers/connectDatabase';
import { AppModule } from '../src/modules/app.module';



export const mockWorkingDirectory = (name: string): string => {
    const testDir = join(getServerTempDir(), 'test', name);

    const spy = jest.spyOn(process, 'cwd');
    spy.mockReturnValue(testDir);

    const spyGetServerDir = jest.spyOn(coreBackend, 'getServerDir');
    spyGetServerDir.mockReturnValue(testDir);

    const spyGetServerTempDir = jest.spyOn(coreBackend, 'getServerTempDir');
    spyGetServerTempDir.mockReturnValue(testDir);

    return testDir;
}

export const setupController = async (name: string) => {
    const testDir = mockWorkingDirectory(name);

    await connectDatabase('test');

    const moduleRef = await Test.createTestingModule({
        imports: [AppModule],
    })
        .compile();

    const app = moduleRef.createNestApplication<NestFastifyApplication>(
        new FastifyAdapter(),
    );

    const server = app.getHttpServer();
    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    return [
        server,
        app,
        testDir,
    ]
}

export const tearDownController = async (app: INestApplication, testDir) => {
    await app?.close();

    await closeConnection();
    await new Promise(done => setTimeout(done, 100));
}