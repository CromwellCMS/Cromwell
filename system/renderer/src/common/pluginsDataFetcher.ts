import { BasePageNames, getStoreItem, isServer, StaticPageContext } from '@cromwell/core';
import { getRestAPIClient } from '@cromwell/core-frontend';

import { fsRequire } from '../helpers/checkCMSConfig';

/**
 * Fetches data for all plugins at specified page. Server-side only.
 * @param pageName 
 * @param context - StaticPageContext of Page
 */
export const pluginsDataFetcher = async (pageName: BasePageNames | string, context: StaticPageContext): Promise<{
    pluginsData: Record<string, any>;
    pluginsSettings: Record<string, any>;
    // pluginsBundles: Record<string, string>;
}> => {
    const cmsSettings = getStoreItem('cmsSettings');
    if (!cmsSettings) {
        throw new Error('pluginsDataFetcher !cmsSettings ' + cmsSettings);
    }
    const restAPIClient = getRestAPIClient();
    const pluginsModifications = await restAPIClient?.getPluginsModifications(pageName);

    const pluginConfigs = pluginsModifications ? Object.entries(pluginsModifications) : undefined;
    // console.log('pageName', pageName, 'pluginConfigs', JSON.stringify(pluginConfigs))
    const pluginsData: Record<string, any> = {};
    const pluginsSettings: Record<string, any> = {}
    // const pluginsBundles: Record<string, string> = {};
    // console.log('pluginConfigs', pluginConfigs);

    if (pluginConfigs && Array.isArray(pluginConfigs)) {
        for (const pluginConfigEntry of pluginConfigs) {
            // console.log('pluginConfig', pluginConfigEntry);
            const pluginName = pluginConfigEntry[0];
            const pluginConfig = pluginConfigEntry[1];
            const pluginContext = Object.assign({}, context);
            pluginContext.pluginsConfig = pluginConfig;

            const settings = await restAPIClient?.getPluginSettings(pluginName);
            if (settings) pluginsSettings[pluginName] = settings;
            // console.log('settings', settings);

            const bundleInfo = await restAPIClient?.getPluginFrontendBundle(pluginName);
            // Require module
            // console.log('pluginConfigObj', pageName, pluginName, pluginConfigObj)
            if (bundleInfo?.cjsPath && isServer()) {
                try {
                    // console.log('pluginsDataFetcher1 bundleInfo.cjsPath', bundleInfo.cjsPath)
                    const plugin: any = fsRequire(bundleInfo.cjsPath);

                    if (!plugin) {
                        console.error('cjs build of the Plugin ' + pluginName + ' was not imported, but used by name at page ' + pageName)
                    } else {
                        const getStaticProps = plugin.getStaticProps;
                        // console.log('plugin', plugin, 'getStaticProps', getStaticProps)

                        let pluginStaticProps = {};
                        if (getStaticProps) {
                            try {
                                pluginStaticProps = await getStaticProps(pluginContext);
                                pluginStaticProps = JSON.parse(JSON.stringify(pluginStaticProps));
                            } catch (e) {
                                console.error('pluginsDataFetcher1', e);
                            }
                        }
                        pluginsData[pluginName] = pluginStaticProps;
                    }

                } catch (e) {
                    console.error('pluginsDataFetcher2', e);
                }
            }

        }
    }
    return {
        pluginsData,
        pluginsSettings,
        // pluginsBundles
    };
}

