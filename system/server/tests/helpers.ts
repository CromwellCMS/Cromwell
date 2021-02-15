import { setStoreItem } from '@cromwell/core';
import { getServerTempDir, readCMSConfig } from '@cromwell/core-backend';
import * as coreBackend from '@cromwell/core-backend';
import { join } from 'path';



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

    return testDir;
}
