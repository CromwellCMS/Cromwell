import { TDefaultPageName, TRegisteredPluginInfo, TStaticPageContext, TStaticPagePluginContext } from '@cromwell/core';
import { getModuleImporter, getRestApiClient } from '@cromwell/core-frontend';

import { fsRequire, getPluginCjsPath } from './initRenderer';

export type TPluginsSettings = Record<string, TRegisteredPluginInfo>;

const cachedPlugins: Record<string, {
    pluginName: string;
    version: string;
    pluginModule: any;
}> = {};

/**
 * Fetches data for all plugins at specified page. Server-side only.
 * @param pageName 
 * @param context - StaticPageContext of Page
 */
export const pluginsDataFetcher = async (pageName: TDefaultPageName | string, context: TStaticPageContext,
    pluginsData?: TPluginsSettings, extraPlugins?: (TRegisteredPluginInfo | string)[]) => {
    const plugins: Record<string, {
        data?: any;
        nextProps?: any;
    }> = {};

    if (!pluginsData) return plugins;

    const configPlugins = Object.values(pluginsData);
    for (const extra of (extraPlugins ?? [])) {
        const extraName = typeof extra === 'object' ? extra.pluginName : extra;

        if (!configPlugins.find(p => {
            const name = typeof p === 'object' ? p.pluginName : p;
            return name === extraName;
        })) {
            if (typeof extra === 'string') {
                const client = getRestApiClient();
                // Register plugin dynamically. Usually Plugins registered in the cromwell.config.js 
                // file or in the DB (by Theme editor). But it's also possible to register
                // plugins by theme authors in `getStaticProps` function. In this case
                // we don't get Plugin's info and settings from `client.getRendererRage` so 
                // we need fetch settings here
                const entity = await client.getPluginEntity(extra);

                let pluginSettings = null;
                try {
                    pluginSettings = entity?.settings && JSON.parse(entity?.settings) || null;
                } catch (error) {
                    console.error('Failed to parse JSON settings of ' + extra, error);
                }
                configPlugins.push({
                    pluginName: extra,
                    // It's better to pass `version` in `extraPlugins` to allow caching
                    version: entity?.version || null,
                    globalSettings: pluginSettings,
                });
            }
            if (typeof extra === 'object') {
                configPlugins.push(extra);
            }
        }
    }

    const promises = configPlugins.map(async data => {
        const { pluginName, globalSettings, version, pluginInstances } = data;
        const pluginContext: TStaticPagePluginContext = Object.assign({}, context);
        pluginContext.pluginSettings = globalSettings;
        pluginContext.pluginInstances = pluginInstances;

        if (!plugins[pluginName]) plugins[pluginName] = {};

        let plugin: any;

        // Try to get plugin from cache
        if (version && cachedPlugins[pluginName]?.version === version) plugin = cachedPlugins[pluginName].pluginModule;

        // require() plugin file
        if (!plugin) {
            const pluginCjsPath = await getPluginCjsPath(pluginName);

            if (!pluginCjsPath?.cjsPath) return;

            try {
                const importer = getModuleImporter();
                if (pluginCjsPath.metaPath && importer?.importScriptExternals) {
                    const meta = await fsRequire(pluginCjsPath.metaPath, true)
                    if (meta) await importer.importScriptExternals(meta);
                }
            } catch (e) {
                console.error(`[Error] pluginsDataFetcher: Failed to require plugin Externals: ${pluginName} at ${pluginCjsPath.metaPath}`, e);
            }

            try {
                plugin = await fsRequire(pluginCjsPath.cjsPath);
            } catch (e) {
                console.error(`[Error] pluginsDataFetcher: Failed to require plugin: ${pluginName} at ${pluginCjsPath.cjsPath}`, e);
            }

            if (plugin && version) {
                cachedPlugins[pluginName] = {
                    pluginName,
                    version,
                    pluginModule: plugin,
                }
            }
        }

        if (!plugin) {
            return;
        }

        const getStaticProps = plugin.getStaticProps;

        let pluginStaticProps;
        if (getStaticProps) {
            try {
                pluginStaticProps = await getStaticProps(pluginContext);
            } catch (e) {
                console.error('[Error] pluginsDataFetcher: Failed to getStaticProps of ' + pluginName, e);
            }
        }
        const { props, ...nextProps } = pluginStaticProps ?? {};
        plugins[pluginName].data = props;
        plugins[pluginName].nextProps = nextProps;
    });

    try {
        await Promise.all(promises);
    } catch (error) {
        console.error(error);
    }

    return plugins;
}

