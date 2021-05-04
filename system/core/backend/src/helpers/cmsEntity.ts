import { CmsEntity } from '../entities/Cms';
import { readCMSConfig } from './cmsConfigHandler';
import { getStoreItem, setStoreItem, TCmsConfig, TCmsSettings } from '@cromwell/core';
import { serverLogFor } from './constants';

export const getCmsEntity = async (): Promise<CmsEntity> => {
    const all = await CmsEntity.find();
    let entity = all?.[0];

    if (!entity) {
        // Probably CMS was launched for the first time and no settings persist in DB.
        // Create settings record
        const config = await readCMSConfig();
        const { versions, ...defaultSettings } = config?.defaultSettings ?? {};
        entity = Object.assign(new CmsEntity(), defaultSettings);
        await entity.save();
    }
    return entity;
}


// Don't re-read cmsconfig.json but update info from DB
export const getCmsSettings = async (): Promise<TCmsSettings | undefined> => {
    let config: TCmsConfig | undefined = undefined;
    const cmsSettings = getStoreItem('cmsSettings');
    if (!cmsSettings) config = await readCMSConfig();

    if (!cmsSettings && !config) {
        serverLogFor('errors-only', 'getCmsSettings: Failed to read CMS config', 'Error');
        return;
    }
    const entity = await getCmsEntity();

    const settings: TCmsSettings = Object.assign({}, cmsSettings,
        config, JSON.parse(JSON.stringify(entity)), { currencies: entity.currencies });

    delete settings.defaultSettings;
    delete (settings as any)._currencies;

    setStoreItem('cmsSettings', settings);
    return settings;
}