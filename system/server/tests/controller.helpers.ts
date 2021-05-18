import { closeConnection, connectDatabase } from '@App/helpers/connectDataBase';
import { AppModule } from '@App/modules/app.module';
import { getStoreItem, setStoreItem } from '@cromwell/core';
import { INestApplication } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import fs from 'fs-extra';
import { resolve } from 'path';

import { mockWorkingDirectory } from './helpers';

export const setupController = async (name: string) => {
    const testDir = await mockWorkingDirectory(name);

    await fs.outputJSON(resolve(testDir, 'package.json'), {
        "name": "@cromwell/test",
        "version": "1.0.0",
        "cromwell": {
            "themes": [
                "@cromwell/theme-store",
                "@cromwell/theme-blog"
            ]
        },
    });

    await connectDatabase();

    let cmsSettings = getStoreItem('cmsSettings');
    if (!cmsSettings) cmsSettings = {};
    cmsSettings.installed = false;
    setStoreItem('cmsSettings', cmsSettings);

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