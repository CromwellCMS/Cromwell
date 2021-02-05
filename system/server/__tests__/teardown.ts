import { getServerTempDir } from '@cromwell/core-backend';
import fs from 'fs-extra';
import { join } from 'path';

export default () => {
    const testDir = join(getServerTempDir(), 'test');
    fs.removeSync(testDir);
}