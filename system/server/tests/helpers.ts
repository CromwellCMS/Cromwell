import { connectDatabase } from '@App/helpers/connectDataBase';
import { MockService } from '@App/services/mock.service';
import { getStoreItem, setStoreItem } from '@cromwell/core';
import { getServerTempDir, readCMSConfig } from '@cromwell/core-backend';
import * as coreBackend from '@cromwell/core-backend';
import fs from 'fs-extra';
import { join, resolve } from 'path';
import { Container } from 'typedi';

export const mockWorkingDirectory = async (name: string): Promise<string> => {
    const testDir = join(getServerTempDir(), 'test', name);

    const spy = jest.spyOn(process, 'cwd');
    spy.mockReturnValue(testDir);

    // const spyGetServerDir = jest.spyOn(coreBackend, 'getServerDir');
    // spyGetServerDir.mockReturnValue(testDir);

    const spyGetServerTempDir = jest.spyOn(coreBackend, 'getServerTempDir');
    spyGetServerTempDir.mockReturnValue(testDir);

    const cmsConfig = await readCMSConfig();
    setStoreItem('cmsSettings', cmsConfig);
    setStoreItem('environment', {
        mode: 'dev',
    });

    return testDir;
}

export const setupConnection = async (name: string) => {
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

    await connectDatabase({ synchronize: true, migrationsRun: false }, true);

    let cmsSettings = getStoreItem('cmsSettings');
    if (!cmsSettings) cmsSettings = {};
    cmsSettings.installed = false;
    setStoreItem('cmsSettings', cmsSettings);

    const mockService = Container.get(MockService);
    await mockService.mockUsers();
    await mockService.mockTags(12);
    await mockService.mockPosts(12);
    await mockService.mockAttributes();
    await mockService.mockCategories(20);
    await mockService.mockProducts(12);
    await mockService.mockReviews(12);
    await mockService.mockOrders(12);

    return testDir;
}