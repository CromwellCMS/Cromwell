import fs from 'fs-extra';
import { resolve } from 'path';

import { buildDirName, configFileName, getNodeModuleDir, getPluginBackendPath, getPluginFrontendBundlePath } from './paths';
import { readCmsModules } from './readCmsModules';

export type TPluginInfo = {
    pluginName: string;
    frontendPath?: string
    adminPanelPath?: string;
    backendPath?: string;
}

export const readPluginsExports = async (): Promise<TPluginInfo[]> => {

    const infos: TPluginInfo[] = [];

    const pluginNames: string[] = (await readCmsModules()).plugins;

    for (const name of pluginNames) {
        const pluginDir = await getNodeModuleDir(name);
        if (pluginDir) {
            const configPath = resolve(pluginDir, configFileName);

            if (await fs.pathExists(configPath)) {

                const pluginInfo: TPluginInfo = {
                    pluginName: name
                };

                const frontendPath = getPluginFrontendBundlePath(resolve(pluginDir, buildDirName));
                if (await fs.pathExists(frontendPath)) {
                    pluginInfo.frontendPath = frontendPath.replace(/\\/g, '/');
                }

                // const adminPanelPath = resolve(pluginsDir, name, config.adminDir, 'index.js');
                // if (await fs.pathExists(adminPanelPath)) {
                //     pluginInfo.adminPanelPath = adminPanelPath.replace(/\\/g, '/');
                // }

                const backendPath = getPluginBackendPath(resolve(pluginDir, buildDirName));
                if (await fs.pathExists(backendPath)) {
                    pluginInfo.backendPath = backendPath
                }

                infos.push(pluginInfo);
            }
        }

    }

    return infos;
}