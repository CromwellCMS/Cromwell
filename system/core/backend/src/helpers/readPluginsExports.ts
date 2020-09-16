import { TCmsConfig, setStoreItem, TPluginConfig } from '@cromwell/core';
import fs from 'fs-extra';
import { resolve } from 'path';
import { getPluginsDir } from './paths';

export type TPluginInfo = {
    pluginName: string;
    frontendPath?: string
    adminPanelPath?: string;
    resolvers?: {
        name: string;
        path: string;
    }[];
    entities?: {
        name: string;
        path: string;
    }[];
}

export const readPluginsExports = (projectRootDir: string): TPluginInfo[] => {

    const infos: TPluginInfo[] = [];

    const pluginsDir = getPluginsDir(projectRootDir);
    const pluginNames: string[] = fs.readdirSync(pluginsDir);
    // console.log('Core:readPluginsExports:: Plugins found:', pluginNames);

    pluginNames?.forEach(name => {
        const configPath = resolve(pluginsDir, name, 'cromwell.config.json');
        if (fs.existsSync(configPath)) {
            let config: TPluginConfig | undefined;
            try {
                config = JSON.parse(fs.readFileSync(configPath, { encoding: 'utf8', flag: 'r' }));
            } catch (e) {
                console.error('Core:readPluginsExports:: ', e);
            }
            if (config) {

                const pluginInfo: TPluginInfo = {
                    pluginName: name
                };

                if (config.frontendDir) {
                    const frontendPath = resolve(pluginsDir, name, config.frontendDir, 'index.js');
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
                if (config.backend) {
                    // Collect entities
                    if (config.backend.entitiesDir) {
                        pluginInfo.entities = [];

                        const entitiesDir = resolve(pluginsDir, name, config.backend.entitiesDir);
                        if (fs.existsSync(entitiesDir)) {
                            const entityFiles: string[] = fs.readdirSync(entitiesDir);
                            entityFiles.forEach(file => {
                                const entityName = `Plugin_${name}_Entity_${file.replace(/.js$/, '')}`;
                                pluginInfo.entities?.push({
                                    name: entityName,
                                    path: resolve(entitiesDir, file).replace(/\\/g, '/')
                                })
                            })
                        }
                    }
                    // Collect resolvers
                    if (config.backend.resolversDir) {
                        pluginInfo.resolvers = [];

                        const resolversDir = resolve(pluginsDir, name, config.backend.resolversDir);
                        if (fs.existsSync(resolversDir)) {
                            const resolverFiles: string[] = fs.readdirSync(resolversDir);
                            resolverFiles.forEach(file => {
                                const resolverName = `Plugin_${name}_Resolver_${file.replace(/.js$/, '')}`;
                                pluginInfo.resolvers?.push({
                                    name: resolverName,
                                    path: resolve(resolversDir, file).replace(/\\/g, '/')
                                })
                            })
                        }
                    }
                }

                infos.push(pluginInfo);
            }
        }
    });

    return infos;

}