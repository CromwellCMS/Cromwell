import { getLogger, readPluginsExports, TBackendModule } from '@cromwell/core-backend';

let pluginsCache: TBackendModule;
const logger = getLogger();

let isCollecting = false;
let collectingPromise: Promise<TBackendModule> | undefined;

export const collectPlugins = async (updateCache?: boolean): Promise<TBackendModule> => {
    if (pluginsCache && !updateCache) return pluginsCache;

    if (isCollecting && collectingPromise) return collectingPromise;
    let collectingResolver;
    collectingPromise = new Promise<TBackendModule>(done => collectingResolver = done);
    isCollecting = true;

    const pluginInfos = await readPluginsExports();

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

            if (resolvers && Array.isArray(resolvers)) collectedResolvers = [...collectedResolvers, ...resolvers]
            if (entities && Array.isArray(entities)) collectedEntities = [...collectedEntities, ...entities]
            if (controllers && Array.isArray(controllers)) collectedControllers = [...collectedControllers, ...controllers]
            if (providers && Array.isArray(providers)) collectedProviders = [...collectedProviders, ...providers]
            if (migrations && Array.isArray(migrations)) collectedMigrations = [...collectedMigrations, ...migrations]
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
