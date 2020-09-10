import { setStoreItem, TCmsConfig } from '@cromwell/core';
import { resolve } from 'path';
import fs from 'fs-extra';

export const readCMSConfig = (projectRootDir: string): TCmsConfig => {
    const configPath = resolve(projectRootDir, 'system/cmsconfig.json');
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

