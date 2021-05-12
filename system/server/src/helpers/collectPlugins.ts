import { readPluginsExports, serverLogFor, getLogger, TBackendModule } from '@cromwell/core-backend';

let pluginsCache: TBackendModule;
const logger = getLogger();

export const collectPlugins = async (): Promise<TBackendModule> => {
    if (pluginsCache) return pluginsCache;
    const pluginInfos = await readPluginsExports();

    serverLogFor('detailed', `Found ${pluginInfos.length} plugins. `
        + pluginInfos.map(info => info.pluginName).join(', '));

    let collectedResolvers: any[] = [];
    let collectedEntities: any[] = [];
    let collectedControllers: any[] = [];
    let collectedProviders: any[] = [];

    pluginInfos.forEach(info => {
        if (info.backendPath) {
            try {
                const { resolvers, entities, controllers, providers } = require(info.backendPath) as TBackendModule;
                if (resolvers && Array.isArray(resolvers)) collectedResolvers = [...collectedResolvers, ...resolvers]
                if (entities && Array.isArray(entities)) collectedEntities = [...collectedEntities, ...entities]
                if (controllers && Array.isArray(controllers)) collectedControllers = [...collectedControllers, ...controllers]
                if (providers && Array.isArray(providers)) collectedProviders = [...collectedProviders, ...providers]
            } catch (error) {
                logger.error(error);
            }
        }
    });

    pluginsCache = {
        resolvers: collectedResolvers,
        entities: collectedEntities,
        controllers: collectedControllers,
        providers: collectedProviders,
    }

    return pluginsCache;
}