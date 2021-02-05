import { getServerTempDir } from '@cromwell/core-backend';
import fs from 'fs-extra';
import { join } from 'path';

import { setupController } from './helpers';


export default async () => {
    const testDir = join(getServerTempDir(), 'test');
    if (await fs.pathExists(testDir)) await fs.remove(testDir);

    await setupController();
};