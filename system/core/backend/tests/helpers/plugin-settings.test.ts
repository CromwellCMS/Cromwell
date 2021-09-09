import fs from 'fs-extra';
import { resolve } from 'path';

import { findPlugin, getPluginSettings, savePluginSettings } from '../../src/helpers/plugin-settings';
import { PluginEntity } from '../../src/models/entities/plugin.entity';
import { connectDatabase, mockWorkingDirectory } from '../helpers';

describe('plugin-exports', () => {

    beforeAll(async () => {
        mockWorkingDirectory('plugin-settings');
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

        const plugin = new PluginEntity();
        plugin.name = '@cromwell/plugin-main-menu';
        plugin.isInstalled = true;
        await plugin.save();
    });

    it('findPlugin', async () => {
        const mainMenu = await findPlugin('@cromwell/plugin-main-menu');
        expect(!!mainMenu).toBeTruthy();
    });

    it('save and get plugin settings', async () => {
        await savePluginSettings('@cromwell/plugin-main-menu', {
            test: '_test_'
        });

        const settings: any = await getPluginSettings('@cromwell/plugin-main-menu');
        expect(settings.test).toEqual('_test_');
    });
});