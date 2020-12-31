import fs from 'fs-extra';
import { resolve } from 'path';

import {
    buildDirName, configFileName, getPluginBackendPath, getPluginFrontendBundlePath,
    getNodeModuleDirSync
} from './paths';
import { readCmsModulesSync } from './readCmsModules';

export type TPluginInfo = {
    pluginName: string;
    frontendPath?: string
    adminPanelPath?: string;
    backendPath?: string;
}

export const readPluginsExportsSync = (): TPluginInfo[] => {

    const infos: TPluginInfo[] = [];

    const pluginNames: string[] = readCmsModulesSync().plugins;

    for (const name of pluginNames) {
        const pluginDir = getNodeModuleDirSync(name);
        if (pluginDir) {
            const configPath = resolve(pluginDir, configFileName);

            if (fs.existsSync(configPath)) {

                const pluginInfo: TPluginInfo = {
                    pluginName: name
                };

                const frontendPath = getPluginFrontendBundlePath(resolve(pluginDir, buildDirName));
                if (fs.existsSync(frontendPath)) {
                    pluginInfo.frontendPath = frontendPath.replace(/\\/g, '/');
                }


                // const adminPanelPath = resolve(pluginsDir, name, config.adminDir, 'index.js');
                // if (fs.existsSync(adminPanelPath)) {
                //     pluginInfo.adminPanelPath = adminPanelPath.replace(/\\/g, '/');
                // }

                const backendPath = getPluginBackendPath(resolve(pluginDir, buildDirName));
                if (fs.existsSync(backendPath)) {
                    pluginInfo.backendPath = backendPath
                }

                infos.push(pluginInfo);
            }
        }

    };

    return infos;

}