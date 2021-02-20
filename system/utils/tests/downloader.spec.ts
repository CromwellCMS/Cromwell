import { downloader } from '@App/downloader';
import { moduleArchiveFileName, moduleLibBuidFileName, moduleMetaInfoFileName } from '@App/constants';
import { getBundledModulesDir } from '@App/shared';
import { TPackageJson } from '@cromwell/core';
import * as fs from 'fs-extra';
import { join, resolve } from 'path';

import { mockWorkingDirectory, tearDown } from './helpers';

const testDir = mockWorkingDirectory('downloader');
const moduleToDownload = 'object-assign';
const pckg: TPackageJson = require(`${moduleToDownload}/package.json`);
if (!pckg) {
    console.error('Failed to require package of module: ' + moduleToDownload);
}

describe('downloader', () => {

    it("downloads package", async () => {

        const buildDir = getBundledModulesDir()
        const moduleBuildDir = resolve(buildDir, `${pckg.name}@${pckg.version}`);

        if (await fs.pathExists(moduleBuildDir)) {
            await fs.remove(moduleBuildDir);
        }

        await downloader({
            targetModule: moduleToDownload
        })
        expect(await fs.pathExists(moduleBuildDir)).toBeTruthy();
        expect(await fs.pathExists(join(moduleBuildDir, moduleArchiveFileName))).toBeTruthy();
        expect(await fs.pathExists(join(moduleBuildDir, moduleMetaInfoFileName))).toBeTruthy();
        expect(await fs.pathExists(join(moduleBuildDir, moduleLibBuidFileName))).toBeTruthy();
    });


    afterAll(async () => {
        await tearDown(testDir);
    });
})