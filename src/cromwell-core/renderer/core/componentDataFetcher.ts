import { PageName } from "../components/types";
import { NextPageContext } from 'next';
const config = require('../../cmsconfig.json');

export const componentDataFetcher = async (pageName: PageName, context: NextPageContext) => {
    const componentsConfig = await import(`../../../templates/${config.templateName}/src/components/componentsConfig.json`);
    const componentsData = {};
    const components: string[] = componentsConfig[pageName];
    if (components && Array.isArray(components)) {
        for (const compName of components) {
            try {
                const { getStaticProps } = await import(`../../../templates/${config.templateName}/src/components/${compName}`);
                let data;
                if (getStaticProps) {
                    data = await getStaticProps(context);
                } else {
                    data = {}
                };
                componentsData[compName] = data;
            } catch (e) {
                console.error(e);
            }
        }
    }
    return componentsData;

}