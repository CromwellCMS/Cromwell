import { spawnSync } from 'child_process';
import fs from 'fs-extra';
import { resolve } from 'path';

export const createTask = async (name?: string, noInstall?: boolean) => {
    if (!name) {
        console.error('You must provide App name, eg.: npx crw create my-app')
        return;
    }

    const dir = resolve(process.cwd(), name + '');

    await fs.ensureDir(dir);

    spawnSync(`npm init -y`, [], { shell: true, stdio: 'inherit', cwd: dir });

    if (!noInstall) {
        spawnSync(`npm i @cromwell/cms @cromwell/theme-store @cromwell/theme-blog @cromwell/plugin-main-menu @cromwell/plugin-newsletter @cromwell/plugin-product-filter @cromwell/plugin-product-showcase --save-exact`
            , [], { shell: true, stdio: 'inherit', cwd: dir });
    }
}
