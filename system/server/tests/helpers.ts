import { getStoreItem, setStoreItem } from '@cromwell/core';
import { getServerTempDir, readCMSConfig } from '@cromwell/core-backend';
import * as coreBackend from '@cromwell/core-backend';
import fs from 'fs-extra';
import { join, resolve } from 'path';

import { connectDatabase } from '../src/helpers/connect-database';

export const mockWorkingDirectory = async (name: string): Promise<string> => {
    const testDir = join(getServerTempDir(), 'test', name);

    const spy = jest.spyOn(process, 'cwd');
    spy.mockReturnValue(testDir);

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
    const setupDBPath = resolve(getServerTempDir(), 'db.sqlite3');
    const testDir = await mockWorkingDirectory(name);

    fs.outputJSONSync(resolve(testDir, 'package.json'), {
        "name": "@cromwell/test",
        "version": "1.0.0",
        "cromwell": {
            "themes": [
                "@cromwell/theme-store",
                "@cromwell/theme-blog"
            ]
        },
    });

    if (fs.pathExistsSync(setupDBPath)) {
        const tempDBPath = resolve(getServerTempDir(), 'db.sqlite3');
        fs.copyFileSync(setupDBPath, tempDBPath);
    }

    await connectDatabase({ synchronize: true, migrationsRun: false }, true);

    let cmsSettings = getStoreItem('cmsSettings');
    if (!cmsSettings) cmsSettings = {};
    cmsSettings.installed = false;
    setStoreItem('cmsSettings', cmsSettings);

    return testDir;
}