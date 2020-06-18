import { BasePageNames, StaticPageContext } from "@cromwell/core";
//@ts-ignore
import { importPage } from '.cromwell/imports/imports.gen';
import { getStoreItem } from "@cromwell/core";
import { checkCMSConfig } from '../helpers/checkCMSConfig';
checkCMSConfig();

export const getThemeStaticProps = async (pageName: BasePageNames | string, context: StaticPageContext): Promise<Record<string, any>> => {
    const cmsconfig = getStoreItem('cmsconfig');
    if (!cmsconfig || !cmsconfig.themeName) {
        console.log('cmsconfig', cmsconfig)
        throw new Error('getThemeStaticProps !cmsconfig.themeName');
    }
    let childStaticProps = {}
    const pageComp: any = await importPage(pageName);
    console.log('getThemeStaticProps', 'pageName', pageName, 'pageComp', pageComp)
    if (pageComp && pageComp.getStaticProps) {
        const childGetStaticProps = pageComp.getStaticProps;
        try {
            childStaticProps = await childGetStaticProps(context);
        } catch (e) {
            console.error('getThemeStaticProps', e);
        }
    }
    return childStaticProps;

}