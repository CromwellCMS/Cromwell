import { spawnSync } from 'child_process';
import fs from 'fs';
import { resolve } from 'path';
import { promisify } from 'util';

export const createTask = async (name?: string, noInstall?: boolean) => {
    if (!name) return;

    const dir = resolve(process.cwd(), name + '');

    await promisify(fs.mkdir)(dir);

    spawnSync(`npm init -y`, [], { shell: true, stdio: 'inherit', cwd: dir });

    if (!noInstall) {
        spawnSync(`npm i @cromwell/cms`, [], { shell: true, stdio: 'inherit', cwd: dir });
    }
}