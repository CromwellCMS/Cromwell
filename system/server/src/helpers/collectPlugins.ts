import { readPluginsExports, serverLogFor, getLogger } from '@cromwell/core-backend';

let pluginsCache;
const logger = getLogger('errors-only');

export const collectPlugins = async (): Promise<{
    resolvers: any[];
    entities: any[];
    controllers: any[];
}> => {
    if (pluginsCache) return pluginsCache;
    const pluginInfos = await readPluginsExports();

    serverLogFor('detailed', `Found ${pluginInfos.length} plugins. `
        + pluginInfos.map(info => info.pluginName).join(', '));

    let pluginsResolvers: any[] = [];
    let pluginsEntities: any[] = [];
    let controllerEntities: any[] = [];

    pluginInfos.forEach(info => {
        if (info.backendPath) {
            try {
                const { resolvers, entities, controllers } = require(info.backendPath);
                if (resolvers && Array.isArray(resolvers)) pluginsResolvers = [...pluginsResolvers, ...resolvers]
                if (entities && Array.isArray(entities)) pluginsEntities = [...pluginsEntities, ...entities]
                if (controllers && Array.isArray(controllers)) controllerEntities = [...controllerEntities, ...controllers]
            } catch (error) {
                logger.error(error);
            }
        }
    });

    pluginsCache = {
        resolvers: pluginsResolvers,
        entities: pluginsEntities,
        controllers: controllerEntities,
    }

    return pluginsCache;
}