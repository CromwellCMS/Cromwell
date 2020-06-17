//@ts-ignore
import { importModule, importTemplateConfig } from '.cromwell/imports/imports.gen';
import { BasePageNames, StaticPageContext, getStoreItem, getRestAPIClient } from "@cromwell/core";
import { checkCMSConfig } from "../helpers/checkCMSConfig";
checkCMSConfig();

/**
 * Fetches data for all modules at specified page.
 * @param pageName 
 * @param context - StaticPageContext of Page
 */
export const modulesDataFetcher = async (pageName: BasePageNames | string, context: StaticPageContext): Promise<Record<string, any>> => {
    const cmsconfig = getStoreItem('cmsconfig');
    if (!cmsconfig || !cmsconfig.templateName) {
        console.log('cmsconfig', cmsconfig)
        throw new Error('modulesDataFetcher !cmsconfig.templateName');
    }
    // Get modifications of user to the current template
    const restAPIClient = getRestAPIClient();
    const modulesUserModifications = await restAPIClient.getModulesModifications();

    // Get default modifications of the template
    const templateConfig = importTemplateConfig();

    // Concat both modifications
    let modulesModifications = {};
    if (templateConfig && templateConfig.modules && typeof templateConfig.modules === 'object') {
        modulesModifications = Object.assign(modulesModifications, templateConfig.modules);
    }
    if (modulesUserModifications && typeof modulesUserModifications === 'object') {
        modulesModifications = Object.assign(modulesModifications, modulesUserModifications);
    }

    const moduleConfigs = Object.entries(modulesModifications);
    console.log('moduleConfigs', moduleConfigs)
    const modulesData: any = {};
    if (moduleConfigs && Array.isArray(moduleConfigs)) {
        for (const moduleConfig of moduleConfigs) {
            // console.log('moduleConfig', moduleConfig);
            const moduleName = moduleConfig[0];
            const moduleConfigObj: any = moduleConfig[1];
            // check if module can be displayed at current page
            if (moduleConfigObj.pages && Array.isArray(moduleConfigObj.pages) && moduleConfigObj.pages.includes(pageName)) {
                const moduleContext = JSON.parse(JSON.stringify(context));
                moduleContext.moduleConfig = moduleConfigObj;
                // console.log('moduleConfigObj', pageName, moduleName, moduleConfigObj)
                try {
                    const module = await importModule(moduleName);
                    if (!module) {
                        console.error('Module ' + moduleName + ' was not imported, but used by name at page ' + pageName)
                    } else {
                        const getStaticProps = (module as any).getStaticProps;
                        // console.log('module', module, 'getStaticProps', getStaticProps)

                        let moduleStaticProps = {};
                        if (getStaticProps) {
                            try {
                                moduleStaticProps = await getStaticProps(moduleContext);
                                // console.log('moduleStaticProps', moduleStaticProps)
                            } catch (e) {
                                console.error('modulesDataFetcher1', e);
                            }
                        }
                        modulesData[moduleName] = moduleStaticProps;
                    }

                } catch (e) {
                    console.error('modulesDataFetcher2', e);
                }
            }
        }
    }
    return modulesData;
}

