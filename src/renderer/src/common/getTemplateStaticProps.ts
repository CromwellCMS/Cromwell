import { PageName, StaticPageContext } from "@cromwell/core";
import { importPage } from '@cromwell/templates';
const config = require('@cromwell/core/cmsconfig.json');

export const getTemplateStaticProps = async (pageName: PageName, context: StaticPageContext) => {
    const childGetStaticProps = (await importPage(config.templateName, 'product')).getStaticProps;
    let childStaticProps = {}
    if (childGetStaticProps) {
        try {
            childStaticProps = await childGetStaticProps(context);
        } catch (e) {
            console.error(e);
        }
    }
    return childStaticProps;
}