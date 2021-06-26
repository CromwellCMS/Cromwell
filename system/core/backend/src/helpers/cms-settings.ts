import { getStoreItem, setStoreItem, TCmsConfig, TCmsSettings } from '@cromwell/core';
import fs from 'fs-extra';

import { CmsEntity } from '../entities/Cms';
import { defaultCmsConfig } from './constants';
import { getLogger } from './logger';
import { getCMSConfigPath } from './paths';

const getEnvConfig = () => {
    return JSON.parse(JSON.stringify({
        apiPort: process.env.API_PORT,
        adminPanelPort: process.env.ADMIN_PORT,
        frontendPort: process.env.FRONTEND_PORT,
        centralServerUrl: process.env.CCS_URL,
    }));
}

/**
 * Read CMS config from file in [project root]/cmsconfig.json, saves it into the store and returns
 */
export const readCMSConfigSync = (): TCmsConfig => {
    const logger = getLogger();
    const configPath = getCMSConfigPath();
    let customConfig;
    if (fs.pathExistsSync(configPath)) {
        try {
            const config = JSON.parse(fs.readFileSync(configPath, { encoding: 'utf8', flag: 'r' }));
            if (config && typeof config === 'object') customConfig = config;
        } catch (e) {
            logger.error('Failed to read CMS config at: ' + configPath + e, 'Error');
        }
    }
    return Object.assign({}, defaultCmsConfig, customConfig, getEnvConfig());
}

/**
 * Read CMS config from file in [project root]/cmsconfig.json, saves it into the store and returns
 */
export const readCMSConfig = async (): Promise<TCmsConfig> => {
    const logger = getLogger();
    const configPath = getCMSConfigPath();
    let customConfig;
    if (await fs.pathExists(configPath)) {
        try {
            const config: TCmsConfig | undefined = await fs.readJSON(configPath);
            if (config && typeof config === 'object') customConfig = config;
        } catch (e) {
            logger.error(e);
        }
    }
    const merged = Object.assign({}, defaultCmsConfig, customConfig, getEnvConfig());
    merged.defaultSettings = Object.assign({}, defaultCmsConfig?.defaultSettings, customConfig?.defaultSettings);
    return merged;
}


export const getCmsEntity = async (): Promise<CmsEntity> => {
    const entity = await CmsEntity.findOne();
    if (entity) return entity;

    // Probably CMS was launched for the first time and no settings persist in DB.
    // Create settings record
    const config = await readCMSConfig();
    const { versions, ...defaultSettings } = config?.defaultSettings ?? {};
    const newEntity = Object.assign(new CmsEntity(), defaultSettings);
    await newEntity.save();
    return newEntity;
}


// Don't re-read cmsconfig.json but update info from DB
export const getCmsSettings = async (): Promise<TCmsSettings | undefined> => {
    const logger = getLogger();
    let config: TCmsConfig | undefined = undefined;
    const cmsSettings = getStoreItem('cmsSettings');
    if (!cmsSettings) config = await readCMSConfig();

    if (!cmsSettings && !config) {
        logger.error('getCmsSettings: Failed to read CMS config', 'Error');
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