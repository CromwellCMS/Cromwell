import { readPluginsExports, } from '@cromwell/core-backend';

export const collectPlugins = (projectRootDir): {
    resolvers: any[],
    entities: any[]
} => {
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
    return {
        resolvers: pluginsResolvers,
        entities: pluginsEntities
    }
}