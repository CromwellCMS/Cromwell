import { PageName, StaticPageContext } from '@cromwell/core';
import { importComponentsConfig, importComponent } from '@cromwell/templates';
const config = require('@cromwell/core/cmsconfig.json');

export const componentDataFetcher = async (pageName: PageName, context: StaticPageContext) => {
    const componentsConfig = await importComponentsConfig(config.templateName);
    const componentsData: any = {};
    const componentsNames: string[] = componentsConfig[pageName];
    if (componentsNames && Array.isArray(componentsNames)) {
        for (const compName of componentsNames) {
            try {
                const getStaticProps = (await importComponent(config.templateName, compName)).getStaticProps;
                let componentStaticProps = {}
                if (getStaticProps) {
                    try {
                        componentStaticProps = await getStaticProps(context);
                    } catch (e) {
                        console.error(e);
                    }
                }
                componentsData[compName] = componentStaticProps;
            } catch (e) {
                console.error(e);
            }
        }
    }
    return componentsData;

}