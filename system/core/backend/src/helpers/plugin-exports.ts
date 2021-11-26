import { getStoreItem } from '@cromwell/core';
import fs from 'fs-extra';
import normalizePath from 'normalize-path';
import { resolve } from 'path';

import { readCmsModules } from './cms-modules';
import { getMigrationsDirName } from './constants';
import { getLogger } from './logger';
import {
    buildDirName,
    getCmsModuleInfo,
    getNodeModuleDir,
    getPluginAdminBundlePath,
    getPluginBackendPath,
    getPluginFrontendBundlePath,
} from './paths';
import { TBackendModule } from './types';

export type TPluginInfo = {
    pluginDir: string;
    pluginName: string;
    frontendPath?: string
    adminPanelPath?: string;
    backendPath?: string;
}

const logger = getLogger();

export const readPluginsExports = async (options?: {
    cwd?: string;
}): Promise<TPluginInfo[]> => {
    const { cwd } = options ?? {};

    const infos: TPluginInfo[] = [];

    const pluginNames: string[] = (await readCmsModules(cwd)).plugins;

    for (const name of pluginNames) {
        const info = await getCmsModuleInfo(name);
        if (!info) continue;

        const pluginDir = await getNodeModuleDir(name);
        if (!pluginDir) continue;

        const pluginInfo: TPluginInfo = {
            pluginName: name,
            pluginDir,
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


let pluginsCache: TBackendModule;
let isCollecting = false;
let collectingPromise: Promise<TBackendModule> | undefined;

export const collectPlugins = async (options?: {
    cwd?: string;
    updateCache?: boolean;
}): Promise<TBackendModule> => {
    const { updateCache, cwd } = options ?? {};
    if (pluginsCache && !updateCache) return pluginsCache;
    if (!updateCache && isCollecting && collectingPromise) return collectingPromise;

    let collectingResolver;
    collectingPromise = new Promise<TBackendModule>(done => collectingResolver = done);
    isCollecting = true;

    const migrationsDirName = getMigrationsDirName(getStoreItem('dbInfo')?.dbType as any);
    const pluginInfos = await readPluginsExports({ cwd });

    logger.info(`Found ${pluginInfos.length} plugins. `
        + pluginInfos.map(info => info.pluginName).join(', '));

    let collectedResolvers: any[] = [];
    let collectedEntities: any[] = [];
    let collectedControllers: any[] = [];
    let collectedProviders: any[] = [];
    let collectedMigrations: any[] = [];

    for (const info of pluginInfos) {
        if (!info.backendPath) continue;
        try {
            const { resolvers, entities, controllers, providers, migrations } = require(info.backendPath) as TBackendModule;

            if (resolvers && Array.isArray(resolvers)) collectedResolvers = [...collectedResolvers, ...resolvers];
            if (entities && Array.isArray(entities)) collectedEntities = [...collectedEntities, ...entities];
            if (controllers && Array.isArray(controllers)) collectedControllers = [...collectedControllers, ...controllers];
            if (providers && Array.isArray(providers)) collectedProviders = [...collectedProviders, ...providers];
            if (migrations && Array.isArray(migrations)) collectedMigrations = [...collectedMigrations, ...migrations];

            if (migrationsDirName) {
                const pluginMigrations = normalizePath(resolve(info.pluginDir, migrationsDirName));
                if (await fs.pathExists(pluginMigrations))
                    collectedMigrations.push(pluginMigrations + '/*.js');
            }
        } catch (error) {
            logger.error('Failed to include plugin: ' + info.backendPath, error);
        }
    }

    pluginsCache = {};
    pluginsCache.resolvers = collectedResolvers;
    pluginsCache.entities = collectedEntities;
    pluginsCache.controllers = collectedControllers;
    pluginsCache.providers = collectedProviders;
    pluginsCache.migrations = collectedMigrations;
    collectingResolver(pluginsCache);
    isCollecting = false;
    collectingPromise = undefined;
    return pluginsCache;
}
