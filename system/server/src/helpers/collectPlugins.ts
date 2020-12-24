import { readPluginsExports, } from '@cromwell/core-backend';

let pluginsCache;

export const collectPlugins = (projectRootDir): {
    resolvers: any[],
    entities: any[]
} => {
    if (pluginsCache) return pluginsCache;
    const pluginInfos = readPluginsExports(projectRootDir);

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