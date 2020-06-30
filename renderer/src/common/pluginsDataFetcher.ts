//@ts-ignore
import { importPlugin, importThemeConfig } from '.cromwell/imports/imports.gen';
import { BasePageNames, StaticPageContext, getStoreItem } from "@cromwell/core";
import { getRestAPIClient } from '@cromwell/core-frontend';
import { checkCMSConfig } from "../helpers/checkCMSConfig";
checkCMSConfig();

/**
 * Fetches data for all plugins at specified page.
 * @param pageName 
 * @param context - StaticPageContext of Page
 */
export const pluginsDataFetcher = async (pageName: BasePageNames | string, context: StaticPageContext): Promise<Record<string, any>> => {
    const cmsconfig = getStoreItem('cmsconfig');
    if (!cmsconfig || !cmsconfig.themeName) {
        console.log('cmsconfig', cmsconfig)
        throw new Error('pluginsDataFetcher !cmsconfig.themeName');
    }
    // Get modifications of user to the current theme
    const restAPIClient = getRestAPIClient();
    const pluginsUserModifications = await restAPIClient.getPluginsModifications();

    // Get default modifications of the theme
    const themeConfig: Record<string, any> = importThemeConfig();

    // Concat both modifications
    let pluginsModifications = {};
    if (themeConfig && themeConfig.plugins && typeof themeConfig.plugins === 'object') {
        pluginsModifications = Object.assign(pluginsModifications, themeConfig.plugins);
    }
    if (pluginsUserModifications && typeof pluginsUserModifications === 'object') {
        pluginsModifications = Object.assign(pluginsModifications, pluginsUserModifications);
    }

    const pluginConfigs = Object.entries(pluginsModifications);
    console.log('pluginConfigs', JSON.stringify(pluginConfigs))
    const pluginsData: any = {};
    if (pluginConfigs && Array.isArray(pluginConfigs)) {
        for (const pluginConfig of pluginConfigs) {
            // console.log('pluginConfig', pluginConfig);
            const pluginName = pluginConfig[0];
            const pluginConfigObj: any = pluginConfig[1];
            // check if plugin can be displayed at current page
            if (pluginConfigObj.pages && Array.isArray(pluginConfigObj.pages) && pluginConfigObj.pages.includes(pageName)) {
                const pluginContext = JSON.parse(JSON.stringify(context));
                pluginContext.pluginConfig = pluginConfigObj;
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
                                // console.log('pluginStaticProps', pluginStaticProps)
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
    return pluginsData;
}

