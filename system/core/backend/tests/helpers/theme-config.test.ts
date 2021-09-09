import fs from 'fs-extra';
import { resolve } from 'path';

import { findTheme, getThemeConfigs } from '../../src/helpers/theme-config';
import { ThemeEntity } from '../../src/models/entities/theme.entity';
import { getCmsEntity } from '../../src/helpers/cms-settings';
import { connectDatabase, mockWorkingDirectory } from '../helpers';

describe('theme-config', () => {

    const themeName = "@cromwell/theme-store";

    beforeAll(async () => {
        mockWorkingDirectory('theme-config');
        fs.outputJSONSync(resolve(process.cwd(), 'package.json'), {
            "name": "@cromwell/core-backend",
            "version": "1.0.0",
            "cromwell": {
                "themes": [
                    "@cromwell/theme-store",
                    "@cromwell/theme-blog",
                ],
                "plugins": [
                    '@cromwell/plugin-main-menu'
                ]
            },
        });
        await connectDatabase();

        const theme = new ThemeEntity();
        theme.name = themeName;
        theme.isInstalled = true;
        theme.defaultSettings = '{ "footerHtml": "_test_" }';
        await theme.save();

        const cms = await getCmsEntity();
        cms.publicSettings = {
            themeName
        }
        await cms.save();
    });

    it('findTheme', async () => {
        const theme = await findTheme(themeName);
        expect(!!theme).toBeTruthy();
    });

    it('getThemeConfigs', async () => {
        const config = await getThemeConfigs()
        expect(config?.themeConfig?.footerHtml).toEqual('_test_');
    });
});