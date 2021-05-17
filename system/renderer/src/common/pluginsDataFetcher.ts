import { BasePageNames, StaticPageContext } from '@cromwell/core';
import { getRestAPIClient, TPluginsModifications } from '@cromwell/core-frontend';

import { fsRequire, getPluginCjsPath } from '../helpers/checkCMSConfig';

/**
 * Fetches data for all plugins at specified page. Server-side only.
 * @param pageName 
 * @param context - StaticPageContext of Page
 */
export const pluginsDataFetcher = async (pageName: BasePageNames | string, context: StaticPageContext): Promise<{
    pluginsData: Record<string, any>;
    pluginsSettings: Record<string, any>;
}> => {
    const restAPIClient = getRestAPIClient();

    let pluginsModifications: Record<string, TPluginsModifications> | undefined;
    try {
        pluginsModifications = await restAPIClient?.getPluginsModifications(pageName);
    } catch (e) {
        console.error(e)
    }
    const pluginConfigs = pluginsModifications ? Object.entries(pluginsModifications) : undefined;
    const pluginsData: Record<string, any> = {};
    const pluginsSettings: Record<string, any> = {};

    const fetchPluginData = async (pluginName: string, pluginConfig: TPluginsModifications): Promise<void> => {
        const pluginContext = Object.assign({}, context);
        pluginContext.pluginsConfig = pluginConfig;

        let settings;
        try {
            settings = await restAPIClient?.getPluginSettings(pluginName);
        } catch (e) {
            console.error(e)
        }
        if (settings) pluginsSettings[pluginName] = settings;

        let pluginCjsPath;
        try {
            pluginCjsPath = await getPluginCjsPath(pluginName);
        } catch (e) {
            console.error(e)
        }

        if (pluginCjsPath) {
            let plugin: any;

            try {
                plugin = await fsRequire(pluginCjsPath);
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
                pluginsData[pluginName] = pluginStaticProps;
            }
        }
    }

    const pluginPromises: Promise<void>[] = [];
    if (pluginConfigs && Array.isArray(pluginConfigs)) {
        for (const pluginConfigEntry of pluginConfigs) {
            pluginPromises.push(
                fetchPluginData(pluginConfigEntry[0], pluginConfigEntry[1])
            );
        }
    }

    await Promise.all(pluginPromises);

    return {
        pluginsData,
        pluginsSettings,
    };
}

