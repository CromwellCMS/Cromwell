import { bundler } from '@App/bundler';
import { moduleArchiveFileName, moduleLibBuidFileName, moduleMetaInfoFileName } from '@App/constants';
import { getBundledModulesDir } from '@App/shared';
import { TPackageJson } from '@cromwell/core';
import * as fs from 'fs-extra';
import { join, resolve } from 'path';

import { mockWorkingDirectory, tearDown } from './helpers';

const testDir = mockWorkingDirectory('bundler');
const moduleToBundle = 'object-assign';
const pckg: TPackageJson = require(`${moduleToBundle}/package.json`);
if (!pckg) {
    console.error('Failed to require package of module: ' + moduleToBundle);
}

describe('bundler', () => {

    it("bundles package", async () => {
        const buildDir = getBundledModulesDir()
        const moduleBuildDir = resolve(buildDir, `${pckg.name}@${pckg.version}`);

        if (await fs.pathExists(moduleBuildDir)) {
            await fs.remove(moduleBuildDir);
        }

        await bundler({
            projectRootDir: process.cwd(),
            isProduction: true,
            targetPackage: moduleToBundle
        });

        expect(await fs.pathExists(moduleBuildDir)).toBeTruthy();
        expect(await fs.pathExists(join(moduleBuildDir, moduleArchiveFileName))).toBeTruthy();
        expect(await fs.pathExists(join(moduleBuildDir, moduleMetaInfoFileName))).toBeTruthy();
        expect(await fs.pathExists(join(moduleBuildDir, moduleLibBuidFileName))).toBeTruthy();

    });


    afterAll(async () => {
        await tearDown(testDir);
    });
})