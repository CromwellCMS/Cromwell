import { spawnSync, spawn } from 'child_process';
import * as fs from 'fs-extra';
import { resolve } from 'path';

describe('cli', () => {

    it("runs create", () => {
        const projName = '_test_name_'
        spawnSync(`npx crw c ${projName} --noInstall`, { shell: true, stdio: 'inherit' });
        expect(fs.existsSync(resolve(process.cwd(), projName))).toBeTruthy();
        fs.removeSync(resolve(process.cwd(), projName));
    })
})