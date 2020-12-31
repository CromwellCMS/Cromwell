import { readPluginsExportsSync, serverLogFor } from '@cromwell/core-backend';

let pluginsCache;

export const collectPlugins = (): {
    resolvers: any[],
    entities: any[]
} => {
    if (pluginsCache) return pluginsCache;
    const pluginInfos = readPluginsExportsSync();

    serverLogFor('detailed', `Found ${pluginInfos.length} plugins. `
        + pluginInfos.map(info => info.pluginName).join(', '));

    let pluginsResolvers: any[] = [];
    let pluginsEntities: any[] = [];
    pluginInfos.forEach(info => {
        if (info.backendPath) {
            const { resolvers, entities } = require(info.backendPath);
            if (resolvers && Array.isArray(resolvers)) pluginsResolvers = [...pluginsResolvers, ...resolvers]
            if (entities && Array.isArray(entities)) pluginsEntities = [...pluginsEntities, ...entities]
        }

    });

    pluginsCache = {
        resolvers: pluginsResolvers,
        entities: pluginsEntities
    }

    return pluginsCache;
}