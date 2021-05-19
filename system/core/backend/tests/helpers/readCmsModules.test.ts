import { TPackageJson } from '@cromwell/core';
import fs from 'fs-extra';
import { resolve } from 'path';

import { readCmsModules } from '../../src/helpers/readCmsModules';
import { mockWorkingDirectory } from '../helpers';

describe('readCmsModules', () => {

    beforeAll(async () => {
        await mockWorkingDirectory('readCmsModules');
    });

    it('reads modules from root package.json', async () => {
        await fs.outputJSON(resolve(process.cwd(), 'package.json'), {
            name: 'test',
            version: '1.0.0',
            cromwell: {
                themes: ['__test1__'],
                plugins: ['__test2__'],
            }
        } as TPackageJson);

        const modules = await readCmsModules();
        expect(modules.plugins.includes('__test2__')).toBeTruthy();
        expect(modules.themes.includes('__test1__')).toBeTruthy();
    });
})