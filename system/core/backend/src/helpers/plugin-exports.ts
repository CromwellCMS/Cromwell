import fs from 'fs-extra';
import normalizePath from 'normalize-path';
import { resolve } from 'path';

import {
    buildDirName,
    getCmsModuleInfo,
    getNodeModuleDir,
    getPluginAdminBundlePath,
    getPluginBackendPath,
    getPluginFrontendBundlePath,
} from './paths';
import { readCmsModules } from './cms-modules';

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
        const info = await getCmsModuleInfo(name);
        if (!info) continue;

        const pluginDir = await getNodeModuleDir(name);
        if (!pluginDir) continue;

        const pluginInfo: TPluginInfo = {
            pluginName: name
        };

        const frontendPath = getPluginFrontendBundlePath(resolve(pluginDir, buildDirName));
        if (await fs.pathExists(frontendPath)) {
            pluginInfo.frontendPath = normalizePath(frontendPath);
        }

        const adminPath = getPluginAdminBundlePath(resolve(pluginDir, buildDirName));
        if (await fs.pathExists(adminPath)) {
            pluginInfo.adminPanelPath = normalizePath(adminPath);
        }

        const backendPath = getPluginBackendPath(resolve(pluginDir, buildDirName));
        if (await fs.pathExists(backendPath)) {
            pluginInfo.backendPath = normalizePath(backendPath)
        }

        infos.push(pluginInfo);
    }

    return infos;
}