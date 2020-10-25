import { TCmsConfig, setStoreItem, TPluginConfig } from '@cromwell/core';
import fs from 'fs-extra';
import { resolve } from 'path';
import { getPluginsDir, getPluginFrontendBundlePath, getPluginBackendPath } from './paths';

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
            let config: TPluginConfig | undefined;
            try {
                config = require(configPath)
            } catch (e) {
                console.error('Core:readPluginsExports:: ', e);
            }
            if (config) {

                const pluginInfo: TPluginInfo = {
                    pluginName: name
                };

                if (config.buildDir) {
                    const frontendPath = getPluginFrontendBundlePath(resolve(pluginsDir, name, config.buildDir));
                    if (fs.existsSync(frontendPath)) {
                        pluginInfo.frontendPath = frontendPath.replace(/\\/g, '/');
                    }
                }
                if (config.adminDir) {
                    const adminPanelPath = resolve(pluginsDir, name, config.adminDir, 'index.js');
                    if (fs.existsSync(adminPanelPath)) {
                        pluginInfo.adminPanelPath = adminPanelPath.replace(/\\/g, '/');
                    }
                }

                if (config.backend && config.buildDir) {
                    const backendPath = getPluginBackendPath(resolve(pluginsDir, name, config.buildDir));
                    if (fs.existsSync(backendPath)) {
                        pluginInfo.backendPath = backendPath
                    }
                }

                infos.push(pluginInfo);
            }
        }
    });

    return infos;

}