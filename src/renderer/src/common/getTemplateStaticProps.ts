import { PageName, StaticPageContext } from "@cromwell/core";
import { importPage } from '@cromwell/templates';
import { getStoreItem, setStoreItem } from "@cromwell/core";
const config = require('../../cmsconfig.json');
setStoreItem('cmsconfig', config);
const cmsconfig = getStoreItem('cmsconfig');

export const getTemplateStaticProps = async (pageName: PageName, context: StaticPageContext) => {
    if (!cmsconfig || !cmsconfig.templateName) {
        console.log('cmsconfig', cmsconfig)
        throw new Error('getTemplateStaticProps !cmsconfig.templateName');
    }
    const childGetStaticProps = (await importPage(cmsconfig.templateName, pageName)).getStaticProps;
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