import { TCmsSettings, TCmsEntity, getStoreItem, setStoreItem, TCmsConfig } from '@cromwell/core';
import { getThemeDir, readCMSConfig, serverLogFor, ThemeEntity } from '@cromwell/core-backend';
import { Injectable } from '@nestjs/common';
import { getCustomRepository } from 'typeorm';
import { projectRootDir } from '../constants';

import { GenericCms } from '../helpers/genericEntities';

const getThemeEntity = async (): Promise<TCmsEntity | undefined> => {
    const cmsRepo = getCustomRepository(GenericCms.repository);
    const all = await cmsRepo.find();
    let entity = all?.[0];

    if (!entity) {
        // Probably CMS was launched for the first time and no settings persist in DB.
        // Create settings record
        const config = await readCMSConfig(projectRootDir);
        if (!config) {
            serverLogFor('errors-only', 'getThemeEntity: Failed to read CMS config', 'Error');
            return undefined;
        }
        entity = await cmsRepo.createEntity(Object.assign({}, config.defaultSettings))
    }

    return entity;
}

// Don't re-read cmsconfig.json but update info from DB
export const getCmsSettings = async (): Promise<TCmsSettings | undefined> => {
    let config: TCmsConfig | undefined = undefined;
    const cmsSettings = getStoreItem('cmsSettings');
    if (!cmsSettings) config = await readCMSConfig(projectRootDir);

    if (!cmsSettings && !config) {
        serverLogFor('errors-only', 'getCmsSettings: Failed to read CMS config', 'Error');
        return;
    }

    const entity = await getThemeEntity();

    const settings: TCmsSettings = Object.assign({}, cmsSettings, config, entity);
    delete settings.defaultSettings;

    //@ts-ignore
    if (settings._currencies) {
        try {
            //@ts-ignore
            settings.currencies = JSON.parse(settings._currencies)
        } catch (e) { serverLogFor('errors-only', 'getCmsSettings: Failed parse currencies', 'Error'); }
        //@ts-ignore
        delete settings._currencies;
    }

    setStoreItem('cmsSettings', settings);
    return settings;
}

@Injectable()
export class CmsService {

    public getSettings = getCmsSettings;

    public async setThemeName(themeName: string) {
        const entity = await getThemeEntity();
        if (entity) {
            entity.themeName = themeName;
            const cmsRepo = getCustomRepository(GenericCms.repository);
            cmsRepo.save(entity);
            return true;
        }
        return false;
    }
}