import { TCmsConfig, setStoreItem, TPluginConfig } from '@cromwell/core';
import fs from 'fs-extra';
import { resolve } from 'path';
import { getPluginsDir, getPluginFrontendBundlePath, getPluginBackendPath, buildDirName } from './paths';
import decache from 'decache';

export type TPluginInfo = {
    pluginName: string;
    frontendPath?: string
    adminPanelPath?: string;
    backendPath?: string;
}

export const readPluginsExports = (projectRootDir: string): TPluginInfo[] => {

    const infos: TPluginInfo[] = [];

    const pluginsDir = getPluginsDir(projectRootDir);
    const pluginNames: string[] = fs.readdirSync(pluginsDir);
    // console.log('Core:readPluginsExports:: Plugins found:', pluginNames);

    pluginNames?.forEach(name => {
        const configPath = resolve(pluginsDir, name, 'cromwell.config.js');
        if (fs.existsSync(configPath)) {



            const pluginInfo: TPluginInfo = {
                pluginName: name
            };


            const frontendPath = getPluginFrontendBundlePath(resolve(pluginsDir, name, buildDirName));
            if (fs.existsSync(frontendPath)) {
                pluginInfo.frontendPath = frontendPath.replace(/\\/g, '/');
            }


            // const adminPanelPath = resolve(pluginsDir, name, config.adminDir, 'index.js');
            // if (fs.existsSync(adminPanelPath)) {
            //     pluginInfo.adminPanelPath = adminPanelPath.replace(/\\/g, '/');
            // }

            const backendPath = getPluginBackendPath(resolve(pluginsDir, name, buildDirName));
            if (fs.existsSync(backendPath)) {
                pluginInfo.backendPath = backendPath
            }

            infos.push(pluginInfo);
        }
    });

    return infos;

}