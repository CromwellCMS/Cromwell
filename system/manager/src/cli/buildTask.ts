import { TThemeConfig } from '@cromwell/core';
import { resolve } from 'path';

import { rendererBuildAndSaveTheme } from '../managers/rendererManager';


export const buildTask = async () => {
    const workingDir = process.cwd();

    const configPath = resolve(workingDir, 'cromwell.config.js');
    let config: TThemeConfig | undefined = undefined;
    try {
        config = require(configPath);
    } catch (e) {
        console.error('Failed to read config at ' + configPath);
        console.error('Make sure config exists and valid');
        console.error(e);
    }
    let isConfigValid = false;
    if (config && config.type) {

        if (config.type === 'theme') {
            isConfigValid = true;
            await rendererBuildAndSaveTheme((message: string) => {
                console.log(message);
            })
        }

        if (config.type === 'plugin') {
            isConfigValid = true;
        }
    }

    if (!isConfigValid) {
        console.error('Error. Config must have "type" property with a value "theme" or "plugin"');

    }


}