import { rollupConfigWrapper } from '@App/plugins/rollup';
import { moduleArchiveFileName, moduleLibBuidFileName, moduleMetaInfoFileName } from '@App/constants';
import { getBundledModulesDir } from '@App/shared';
import { TModuleConfig, TPackageCromwellConfig, TPackageJson } from '@cromwell/core';
import * as fs from 'fs-extra';
import { join, resolve } from 'path';

import { mockWorkingDirectory, tearDown } from './helpers';

const testDir = mockWorkingDirectory('rollup');
const moduleToBundle = 'object-assign';
const pckg: TPackageJson = require(`${moduleToBundle}/package.json`);
if (!pckg) {
    console.error('Failed to require package of module: ' + moduleToBundle);
}

describe('rollup', () => {

    it("creates plugin options", async () => {

        const moduleInfo: TPackageCromwellConfig = {
            type: 'plugin',
        }
        const pckg: TPackageJson = {
            name: 'test',
            version: '1',
            cromwell: moduleInfo
        }
        const moduleConfig: TModuleConfig = {
            // adminInputFile: 'index.js'
        }

        await fs.outputJSON(join(testDir, 'package.json'), pckg);
        await fs.outputFile(
            join(testDir, 'src/admin/index.js'),
            `export default () => 'test';`
        );
        await fs.outputFile(
            join(testDir, 'src/frontend/index.js'),
            `export default () => 'test';`
        );
        await fs.outputFile(
            join(testDir, 'src/backend/entities/index.js'),
            `class TestEnt {}; export default TestEnt;`
        );
        await fs.outputFile(
            join(testDir, 'src/backend/resolvers/index.js'),
            `class TestResolver {}; export default TestResolver;`
        );

        const configs = await rollupConfigWrapper(moduleInfo);
        expect(configs.length).toEqual(5);
    });


    it("creates theme options", async () => {

        const moduleInfo: TPackageCromwellConfig = {
            type: 'theme',
        }
        const pckg: TPackageJson = {
            name: 'test',
            version: '1',
            cromwell: moduleInfo
        }
        const moduleConfig: TModuleConfig = {
            // adminInputFile: 'index.js'
        }

        await fs.outputJSON(join(testDir, 'package.json'), pckg);
        await fs.outputFile(
            join(testDir, 'src/pages/index.js'),
            `export default () => 'test';`
        );

        await fs.outputFile(
            join(testDir, 'src/admin-panel/index.js'),
            `export default () => 'test';`
        );

        const configs = await rollupConfigWrapper(moduleInfo);

        expect(configs.length).toEqual(3);

    });



    afterAll(async () => {
        await tearDown(testDir);
    });
})