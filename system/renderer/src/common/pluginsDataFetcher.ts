//@ts-ignore
import { importPlugin, importThemeConfig } from 'imports/imports.gen';
import { BasePageNames, StaticPageContext, getStoreItem } from "@cromwell/core";
import { getRestAPIClient } from '@cromwell/core-frontend';
import { checkCMSConfig } from "../helpers/checkCMSConfig";
checkCMSConfig();

/**
 * Fetches data for all plugins at specified page.
 * @param pageName 
 * @param context - StaticPageContext of Page
 */
export const pluginsDataFetcher = async (pageName: BasePageNames | string, context: StaticPageContext): Promise<{
    pluginsData: Record<string, any>;
    pluginsSettings: Record<string, any>;
}> => {
    const cmsconfig = getStoreItem('cmsconfig');
    if (!cmsconfig || !cmsconfig.themeName) {
        console.log('cmsconfig', cmsconfig)
        throw new Error('pluginsDataFetcher !cmsconfig.themeName');
    }
    const restAPIClient = getRestAPIClient();
    const pluginsModifications = await restAPIClient?.getPluginsModifications(pageName);

    const pluginConfigs = pluginsModifications ? Object.entries(pluginsModifications) : undefined;
    // console.log('pageName', pageName, 'pluginConfigs', JSON.stringify(pluginConfigs))
    const pluginsData: any = {};
    const pluginsSettings: any = {}

    if (pluginConfigs && Array.isArray(pluginConfigs)) {
        for (const pluginConfig of pluginConfigs) {
            // console.log('pluginConfig', pluginConfig);
            const pluginName = pluginConfig[0];
            const pluginConfigObj: any = pluginConfig[1];
            const pluginContext = JSON.parse(JSON.stringify(context));
            pluginContext.pluginConfig = pluginConfigObj;

            const settings = await restAPIClient?.getPluginSettings(pluginName);
            if (settings) pluginsSettings[pluginName] = settings;
            // console.log('pluginConfigObj', pageName, pluginName, pluginConfigObj)
            try {
                const plugin = await importPlugin(pluginName);
                if (!plugin) {
                    console.error('Plugin ' + pluginName + ' was not imported, but used by name at page ' + pageName)
                } else {
                    const getStaticProps = (plugin as any).getStaticProps;
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
    return {
        pluginsData,
        pluginsSettings
    };
}

