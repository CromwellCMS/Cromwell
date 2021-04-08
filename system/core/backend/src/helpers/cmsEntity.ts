import { CmsEntity } from '../entities/Cms';
import { readCMSConfig } from './cmsConfigHandler';

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
