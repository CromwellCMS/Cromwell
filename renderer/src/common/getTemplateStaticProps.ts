import { BasePageNames, StaticPageContext } from "@cromwell/core";
import { importPage } from '../../.cromwell/imports/gen.imports';
import { getStoreItem } from "@cromwell/core";
import { checkCMSConfig } from '../helpers/checkCMSConfig';
checkCMSConfig();

export const getTemplateStaticProps = async (pageName: BasePageNames | string, context: StaticPageContext): Promise<Record<string, any>> => {
    const cmsconfig = getStoreItem('cmsconfig');
    if (!cmsconfig || !cmsconfig.templateName) {
        console.log('cmsconfig', cmsconfig)
        throw new Error('getTemplateStaticProps !cmsconfig.templateName');
    }
    let childStaticProps = {}
    const pageComp: any = await importPage(pageName);
    console.log('getTemplateStaticProps', 'pageName', pageName, 'pageComp', pageComp)
    if (pageComp && pageComp.getStaticProps) {
        const childGetStaticProps = pageComp.getStaticProps;
        try {
            childStaticProps = await childGetStaticProps(context);
        } catch (e) {
            console.error('getTemplateStaticProps', e);
        }
    }
    return childStaticProps;

}