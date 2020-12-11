import { setStoreItem, getStoreItem, TCmsConfig } from '@cromwell/core';
import { resolve } from 'path';
import fs from 'fs-extra';
import { getCMSConfigPath, getThemeDir } from './paths';

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
    setStoreItem('cmsconfig', config);
    return config;
}

/**
 * Read CMS config from file in system/cmsconfig.json, saves it into the store and returns
 * @param projectRootDir 
 */
export const readCMSConfig = async (projectRootDir: string): Promise<TCmsConfig | undefined> => {
    const configPath = getCMSConfigPath(projectRootDir);
    let config: TCmsConfig | undefined = undefined;

    if (await fs.pathExists(configPath)) {
        const data = await fs.readFile(configPath);
        try {
            config = JSON.parse(data.toString());
            if (config && typeof config === 'object') {
                setStoreItem('cmsconfig', config);
                return config
            }
        } catch (e) {
            console.error(e);
        }
    }
    console.log('Failed to read CMS Config ');
    return;

}

// /**
//  * Tries to get saved config from the store and if not found, will call readCMSConfigSync
//  */
// export const getCMSConfigSync = (projectRootDir: string): TCmsConfig | undefined => {
//     let config: TCmsConfig | undefined = getStoreItem('cmsconfig');
//     if (!config) {
//         try {
//             config = readCMSConfigSync(projectRootDir);
//         } catch (e) {
//             console.log(e);
//         }
//     }
//     return config;
// }

export const saveCMSConfigSync = (projectRootDir: string, config: TCmsConfig) => {
    const configPath = getCMSConfigPath(projectRootDir);
    fs.writeJSONSync(configPath, config, { spaces: 2 });
}

export const saveCMSConfig = async (projectRootDir: string, config: TCmsConfig) => {
    const configPath = getCMSConfigPath(projectRootDir);
    await fs.writeJSON(configPath, config, { spaces: 2 });
}

export const getCurrentThemeDir = async (projectRootDir: string): Promise<string | undefined> => {
    const config = await readCMSConfig(projectRootDir);
    if (config && config.themeName) {
        return getThemeDir(projectRootDir, config.themeName);
    }
}