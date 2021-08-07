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
        expect(config.useWatch).toEqual(defaultCmsConfig.useWatch);
        expect(config.defaultSettings?.publicSettings?.defaultPageSize).toEqual(defaultCmsConfig.defaultSettings?.publicSettings?.defaultPageSize);
    });

    it('read cms config async and and return default settings', async () => {
        const config = await readCMSConfig();
        expect(config.adminPanelPort).toEqual(defaultCmsConfig.adminPanelPort);
        expect(config.useWatch).toEqual(defaultCmsConfig.useWatch);
        expect(config.defaultSettings?.publicSettings?.defaultPageSize).toEqual(defaultCmsConfig.defaultSettings?.publicSettings?.defaultPageSize);
    });

    it('creates new cms entity with default settings', async () => {
        const entity = await getCmsEntity();
        expect(entity.publicSettings?.defaultPageSize).toEqual(defaultCmsConfig?.defaultSettings?.publicSettings?.defaultPageSize);
        expect(entity.publicSettings?.themeName).toEqual(defaultCmsConfig?.defaultSettings?.publicSettings?.themeName);
    });

    it('merges default settings and CMS config', async () => {
        const entity = await getCmsEntity();
        expect(entity.publicSettings?.defaultPageSize).toEqual(defaultCmsConfig?.defaultSettings?.publicSettings?.defaultPageSize);
        expect(entity.publicSettings?.themeName).toEqual(defaultCmsConfig?.defaultSettings?.publicSettings?.themeName);
    });

});
