import { logFor, TCmsConfig } from '@cromwell/core';
import fs from 'fs-extra';
import { getCMSConfigPath } from './paths';
import { serverLogFor, defaultCmsConfig } from './constants';

/**
 * Read CMS config from file in [project root]/cmsconfig.json, saves it into the store and returns
 */
export const readCMSConfigSync = (): TCmsConfig => {
    const configPath = getCMSConfigPath();
    let customConfig;
    if (fs.pathExistsSync(configPath)) {
        try {
            const config = JSON.parse(fs.readFileSync(configPath, { encoding: 'utf8', flag: 'r' }));
            if (config && typeof config === 'object') customConfig = config;
        } catch (e) {
            serverLogFor('errors-only', 'Failed to read CMS config at: ' + configPath + e, 'Error');
        }
    }
    return Object.assign({}, defaultCmsConfig, customConfig);
}

/**
 * Read CMS config from file in [project root]/cmsconfig.json, saves it into the store and returns
 */
export const readCMSConfig = async (): Promise<TCmsConfig> => {
    const configPath = getCMSConfigPath();
    let customConfig;
    if (await fs.pathExists(configPath)) {
        try {
            const config: TCmsConfig | undefined = await fs.readJSON(configPath);
            if (config && typeof config === 'object') customConfig = config;
        } catch (e) {
            console.error(e);
        }
    }
    return Object.assign({}, defaultCmsConfig, customConfig);
}