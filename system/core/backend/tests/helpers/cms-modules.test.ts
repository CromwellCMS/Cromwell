import { TPackageJson } from '@cromwell/core';
import fs from 'fs-extra';
import { resolve } from 'path';

import { readCmsModules } from '../../src/helpers/cms-modules';
import { mockWorkingDirectory } from '../helpers';

describe('cms-modules', () => {

    beforeAll(() => {
        mockWorkingDirectory('cms-modules')
    });

    it('reads cms modules from package.json', async () => {
        fs.outputJSONSync(resolve(process.cwd(), 'package.json'), {
            "name": "@cromwell/core-backend",
            "version": "1.0.0",
            "cromwell": {
                "themes": [
                    "__test2__",
                    "@cromwell/theme-blog",
                ],
                plugins: ['__test2__'],
            },
        } as TPackageJson);

        const modules = await readCmsModules();
        expect(modules.themes.includes('__test2__')).toBeTruthy();
        expect(modules.plugins.includes('__test2__')).toBeTruthy();
    });
});