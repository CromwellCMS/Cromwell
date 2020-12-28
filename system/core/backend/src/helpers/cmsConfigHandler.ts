import { TCmsConfig } from '@cromwell/core';
import fs from 'fs-extra';

import { getCMSConfigPath } from './paths';

/**
 * Read CMS config from file in system/cmsconfig.json, saves it into the store and returns
 * @param projectRootDir 
 */
export const readCMSConfigSync = (projectRootDir: string): TCmsConfig => {
    const configPath = getCMSConfigPath(projectRootDir);
    let config: TCmsConfig | undefined = undefined;
    try {
        config = JSON.parse(fs.readFileSync(configPath, { encoding: 'utf8', flag: 'r' }));
    } catch (e) {
        console.log('renderer::server ', e);
    }
    if (!config) throw new Error('core::readConfig cannot read CMS config');
    return config;
}

/**
 * Read CMS config from file in system/cmsconfig.json, saves it into the store and returns
 * @param projectRootDir 
 */
export const readCMSConfig = async (projectRootDir: string): Promise<TCmsConfig | undefined> => {
    const configPath = getCMSConfigPath(projectRootDir);
    if (await fs.pathExists(configPath)) {
        try {
            const config: TCmsConfig | undefined = await fs.readJSON(configPath);
            if (config && typeof config === 'object') {
                return config
            }
        } catch (e) {
            console.error(e);
        }
    }
    console.log('Failed to read CMS Config ');
    return;

}