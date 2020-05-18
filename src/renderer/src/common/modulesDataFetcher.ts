import { PageName, StaticPageContext } from '@cromwell/core';
import { importModule, importConfig } from '@cromwell/templates';
const config = require('@cromwell/core/cmsconfig.json');

/**
 * Fetches data for all modules at specified page.
 * @param pageName 
 * @param context - StaticPageContext of Page
 */
export const modulesDataFetcher = async (pageName: PageName, context: StaticPageContext): Promise<Object> => {
    const templateConfig = await importConfig(config.templateName);
    const moduleConfigs = Object.entries(templateConfig.modules);
    const modulesData: any = {};
    if (moduleConfigs && Array.isArray(moduleConfigs)) {
        for (const moduleConfig of moduleConfigs) {
            console.log('moduleConfig', moduleConfig);
            const moduleName = moduleConfig[0];
            const moduleConfigObj: any = moduleConfig[1];
            // check if module can be displayed at current page
            if (moduleConfigObj.pages && Array.isArray(moduleConfigObj.pages) && moduleConfigObj.pages.includes(pageName)) {
                const moduleContext = JSON.parse(JSON.stringify(context));
                moduleContext.moduleConfig = moduleConfigObj;
                try {
                    const getStaticProps = (await importModule(config.templateName, moduleName)).getStaticProps;
                    let moduleStaticProps = {};
                    if (getStaticProps) {
                        try {
                            moduleStaticProps = await getStaticProps(moduleContext);
                        } catch (e) {
                            console.error(e);
                        }
                    }
                    modulesData[moduleName] = moduleStaticProps;
                } catch (e) {
                    console.error(e);
                }
            }
        }
    }
    return modulesData;

}