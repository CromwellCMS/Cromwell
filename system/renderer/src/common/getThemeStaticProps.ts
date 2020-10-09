import { BasePageNames, StaticPageContext } from "@cromwell/core";
import { getStoreItem } from "@cromwell/core";
import { checkCMSConfig } from '../helpers/checkCMSConfig';

/**
 * Server-side only
 * @param pageName 
 * @param PageExports 
 * @param context 
 */
export const getThemeStaticProps = async (pageName: BasePageNames | string, PageExports: any, context: StaticPageContext): Promise<Record<string, any>> => {
    const cmsconfig = getStoreItem('cmsconfig');
    if (!cmsconfig || !cmsconfig.themeName) {
        console.log('cmsconfig', cmsconfig)
        throw new Error('getThemeStaticProps !cmsconfig.themeName');
    }
    let childStaticProps = {}
    console.log('getThemeStaticProps', 'pageName', pageName, 'pageComp', PageExports)
    if (PageExports && PageExports.getStaticProps) {
        const childGetStaticProps = PageExports.getStaticProps;
        try {
            childStaticProps = await childGetStaticProps(context);
            childStaticProps = JSON.parse(JSON.stringify(childStaticProps));
        } catch (e) {
            console.error('getThemeStaticProps', e);
        }
    }
    return childStaticProps;

}