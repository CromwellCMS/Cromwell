import { BasePageNames, StaticPageContext } from '@cromwell/core';

/**
 * Server-side only
 * @param pageName 
 * @param PageExports 
 * @param context 
 */
export const getThemeStaticProps = async (pageName: BasePageNames | string,
    pageGetStaticProps: ((context: StaticPageContext) => any) | undefined | null,
    context: StaticPageContext): Promise<Record<string, any>> => {

    let childStaticProps = {}
    if (pageGetStaticProps) {
        try {
            childStaticProps = await pageGetStaticProps(context);
        } catch (e) {
            console.error('[Error] getThemeStaticProps: failed to get StaticProps of page: ' + pageName, e);
        }
    }
    return childStaticProps;
}