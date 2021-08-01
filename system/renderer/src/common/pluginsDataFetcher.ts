import { StaticPageContext, TDefaultPageName } from '@cromwell/core';
import { getModuleImporter } from '@cromwell/utils/build/importer.js';

import { fsRequire, getPluginCjsPath } from '../helpers/checkCMSConfig';

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
export const pluginsDataFetcher = async (pageName: TDefaultPageName | string, context: StaticPageContext,
    pluginsData?: {
        pluginName: string;
        version?: string;
        globalSettings?: any;
    }[]) => {
    const plugins: Record<string, {
        data?: any;
    }> = {};

    if (!pluginsData) return plugins;

    const uniquePlugins = [...new Set(pluginsData.map(plugin => plugin.pluginName))]
        .map(name => pluginsData.find(plugin => plugin.pluginName === name)) as typeof pluginsData;

    const promises = uniquePlugins.map(async data => {
        const { pluginName, globalSettings, version } = data;
        const pluginContext = Object.assign({}, context);
        pluginContext.pluginSettings = globalSettings;

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
        plugins[pluginName].data = pluginStaticProps;
    });

    try {
        await Promise.all(promises);
    } catch (error) {
        console.error(error);
    }

    return plugins;
}

