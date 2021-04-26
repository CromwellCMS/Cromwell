import { downloader, TPackage } from '@cromwell/utils';
import { getTempDir, getManagerDir } from '@cromwell/core-backend';
import { resolve } from 'path';
import fs from 'fs-extra';

// If cms launched for the first time, we need to download bundled modules
export const checkModules = async (isDevelopment?: boolean, pckgs?: TPackage[]) => {
    if (!pckgs) {
        await downloader();
    }
    if (pckgs) {
        await downloader({ packages: pckgs });
    }
}

export const checkConfigs = async () => {
    const nginxDir = resolve(getTempDir(), 'nginx');
    const managerDir = getManagerDir();
    if (managerDir && ! await fs.pathExists(nginxDir)) {
        const managerNginxDir = resolve(managerDir, 'docker/nginx');
        if (await fs.pathExists(managerNginxDir))
            await fs.copy(managerNginxDir, nginxDir);
    }
}