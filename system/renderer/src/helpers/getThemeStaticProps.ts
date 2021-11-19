import { TDefaultPageName, TStaticPageContext } from '@cromwell/core';

/**
 * Server-side only
 * @param pageName 
 * @param PageExports 
 * @param context 
 */
export const getThemeStaticProps = async (pageName: TDefaultPageName | string,
    pageGetStaticProps: ((context: TStaticPageContext) => any) | undefined | null,
    context: TStaticPageContext): Promise<Record<string, any>> => {

    let childStaticProps = {}
    if (pageGetStaticProps) {
        try {
            childStaticProps = (await pageGetStaticProps(context)) ?? {};
        } catch (e) {
            console.error('[Error] getThemeStaticProps: failed to get StaticProps of page: ' + pageName, e);
        }
    }
    return childStaticProps;
}