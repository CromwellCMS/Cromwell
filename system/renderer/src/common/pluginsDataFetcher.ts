import { BasePageNames, StaticPageContext } from '@cromwell/core';
import { getRestAPIClient, TPluginsModifications } from '@cromwell/core-frontend';
import { getModuleImporter } from '@cromwell/utils/build/importer.js';

import { fsRequire, getPluginCjsPath } from '../helpers/checkCMSConfig';

/**
 * Fetches data for all plugins at specified page. Server-side only.
 * @param pageName 
 * @param context - StaticPageContext of Page
 */
export const pluginsDataFetcher = async (pageName: BasePageNames | string, context: StaticPageContext) => {
    const restAPIClient = getRestAPIClient();

    let pluginsModifications: Record<string, TPluginsModifications> | undefined;
    try {
        pluginsModifications = await restAPIClient?.getPluginsModifications(pageName);
    } catch (e) {
        console.error(e)
    }
    const pluginConfigs = pluginsModifications ? Object.entries(pluginsModifications) : undefined;

    const plugins: Record<string, {
        data?: any;
        settings?: any;
    }> = {};

    const fetchPluginData = async (pluginName: string, pluginConfig: TPluginsModifications): Promise<void> => {
        const pluginContext = Object.assign({}, context);
        pluginContext.pluginsConfig = pluginConfig;

        if (!plugins[pluginName]) plugins[pluginName] = {};

        let settings;
        try {
            settings = await restAPIClient?.getPluginSettings(pluginName);
        } catch (e) {
            console.error(e)
        }
        if (settings) plugins[pluginName].settings = settings;

        const pluginCjsPath = await getPluginCjsPath(pluginName);

        if (!pluginCjsPath?.cjsPath) return;

        try {
            const importer = getModuleImporter();
            if (pluginCjsPath.metaPath && importer?.importSciptExternals) {
                const meta = await fsRequire(pluginCjsPath.metaPath, true)
                if (meta) await importer.importSciptExternals(meta);
            }
        } catch (e) {
            console.error('[Error] pluginsDataFetcher: Failed to require plugin Externals: ' + pluginName, e);
        }

        let plugin: any;

        try {
            plugin = await fsRequire(pluginCjsPath.cjsPath);
        } catch (e) {
            console.error('[Error] pluginsDataFetcher: Failed to require plugin: ' + pluginName, e);
        }

        if (!plugin) {
            console.error('[Error] pluginsDataFetcher: cjs build of the Plugin ' + pluginName + ' was not imported, but used by name at page ' + pageName)
        } else {
            const getStaticProps = plugin.getStaticProps;

            let pluginStaticProps = {};
            if (getStaticProps) {
                try {
                    pluginStaticProps = await getStaticProps(pluginContext);
                    pluginStaticProps = JSON.parse(JSON.stringify(pluginStaticProps));
                } catch (e) {
                    console.error('[Error] pluginsDataFetcher: Failed to getStaticProps of ' + pluginName, e);
                }
            }
            plugins[pluginName].data = pluginStaticProps;
        }
    }

    const pluginPromises: Promise<void>[] = [];
    if (pluginConfigs && Array.isArray(pluginConfigs)) {
        for (const pluginConfigEntry of pluginConfigs) {
            pluginPromises.push(
                fetchPluginData(pluginConfigEntry[0], pluginConfigEntry[1]).catch(e => console.error(e))
            );
        }
    }

    try {
        await Promise.all(pluginPromises);
    } catch (error) {
        console.error(error);
    }

    return plugins;
}

