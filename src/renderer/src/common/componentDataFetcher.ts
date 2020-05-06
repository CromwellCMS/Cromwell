import { PageName } from '@cromwell/core';
import { NextPageContext } from 'next';
import { importComponentsConfig } from '@cromwell/templates';
const config = require('@cromwell/core/cmsconfig.json');

export const componentDataFetcher = async (pageName: PageName, context: NextPageContext) => {
    const componentsConfig = await importComponentsConfig(config.templateName);
    const componentsData: any = {};
    const components: string[] = componentsConfig[pageName];
    if (components && Array.isArray(components)) {
        for (const compName of components) {
            try {
                // const { getStaticProps } = await import(`../../../templates/${config.templateName}/src/components/${compName}`);
                let data = {};
                // if (getStaticProps) {
                //     data = await getStaticProps(context);
                // } else {
                //     data = {}
                // };
                componentsData[compName] = data;
            } catch (e) {
                console.error(e);
            }
        }
    }
    return componentsData;

}