import { PageName, StaticPageContext } from "@cromwell/core";
import { importPage } from '@cromwell/templates';
import { getStoreItem } from "@cromwell/core";
import { checkCMSConfig } from './modulesDataFetcher';
checkCMSConfig();

export const getTemplateStaticProps = async (pageName: PageName, context: StaticPageContext) => {
    const cmsconfig = getStoreItem('cmsconfig');
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