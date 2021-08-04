import { getUtilsTempDir } from '@cromwell/core-backend';
import * as fs from 'fs-extra';
import { join } from 'path';

export const mockWorkingDirectory = (name: string): string => {
    const testDir = join(getUtilsTempDir(), 'test', name);

    const spy = jest.spyOn(process, 'cwd');
    spy.mockReturnValue(testDir);

    // const cmsConfig = await readCMSConfig();
    // setStoreItem('cmsSettings', cmsConfig);
    return testDir;
}

export const tearDown = async (testDir: string) => {
    await fs.remove(testDir);
}