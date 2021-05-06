import { getCmsEntity, readCMSConfig, readCMSConfigSync } from '../../src/helpers/cms-settings';
import { defaultCmsConfig } from '../../src/helpers/constants';
import { connectDatabase, mockWorkingDirectory } from '../helpers';

describe('cms config / settings', () => {

    beforeAll(async () => {
        await mockWorkingDirectory('cms-settings');
        await connectDatabase();
    });

    it('read cms config and and return default settings', () => {
        const config = readCMSConfigSync();
        expect(config.adminPanelPort).toEqual(defaultCmsConfig.adminPanelPort);
        expect(config.pluginApiPort).toEqual(defaultCmsConfig.pluginApiPort);
        expect(config.useWatch).toEqual(defaultCmsConfig.useWatch);
        expect(config.defaultSettings?.defaultPageSize).toEqual(defaultCmsConfig.defaultSettings?.defaultPageSize);
    });

    it('read cms config async and and return default settings', async () => {
        const config = await readCMSConfig();
        expect(config.adminPanelPort).toEqual(defaultCmsConfig.adminPanelPort);
        expect(config.pluginApiPort).toEqual(defaultCmsConfig.pluginApiPort);
        expect(config.useWatch).toEqual(defaultCmsConfig.useWatch);
        expect(config.defaultSettings?.defaultPageSize).toEqual(defaultCmsConfig.defaultSettings?.defaultPageSize);
    });

    it('creates new cms entity with default settings', async () => {
        const entity = await getCmsEntity();
        expect(entity.defaultPageSize).toEqual(defaultCmsConfig?.defaultSettings?.defaultPageSize);
        expect(entity.themeName).toEqual(defaultCmsConfig?.defaultSettings?.themeName);
    });

    it('merges default settings and CMS config', async () => {
        const entity = await getCmsEntity();
        expect(entity.defaultPageSize).toEqual(defaultCmsConfig?.defaultSettings?.defaultPageSize);
        expect(entity.themeName).toEqual(defaultCmsConfig?.defaultSettings?.themeName);
    });

});
