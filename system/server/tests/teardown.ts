import { getServerTempDir } from '@cromwell/core-backend';
import fs from 'fs-extra';

export default () => {
    const testDir = getServerTempDir();
    fs.removeSync(testDir);
    process.exit(0);
}