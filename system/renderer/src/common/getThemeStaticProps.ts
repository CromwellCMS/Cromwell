import { BasePageNames, getStoreItem, StaticPageContext } from '@cromwell/core';

/**
 * Server-side only
 * @param pageName 
 * @param PageExports 
 * @param context 
 */
export const getThemeStaticProps = async (pageName: BasePageNames | string,
    pageGetStaticProps: ((context: StaticPageContext) => any) | undefined | null,
    context: StaticPageContext): Promise<Record<string, any>> => {

    const cmsSettings = getStoreItem('cmsSettings');
    if (!cmsSettings) {
        throw new Error('getThemeStaticProps !cmsSettings ' + cmsSettings);
    }
    let childStaticProps = {}
    if (pageGetStaticProps) {
        try {
            childStaticProps = await pageGetStaticProps(context);
            childStaticProps = JSON.parse(JSON.stringify(childStaticProps));
        } catch (e) {
            console.error('getThemeStaticProps', e);
            console.log('pageName: ', pageName, 'pageGetStaticProps', pageGetStaticProps)
        }
    }
    return childStaticProps;

}