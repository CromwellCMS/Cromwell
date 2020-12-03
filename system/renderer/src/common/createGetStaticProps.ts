import { BasePageNames, TCromwellPageCoreProps, StaticPageContext } from '@cromwell/core';
import { getRestAPIClient } from '@cromwell/core-frontend';
import { getThemeStaticProps } from './getThemeStaticProps';
import { pluginsDataFetcher } from './pluginsDataFetcher';

export const createGetStaticProps = (pageName: BasePageNames | string,
    pageGetStaticProps: ((context: StaticPageContext) => any) | undefined | null) => {
    return async function (context: StaticPageContext): Promise<
        { props: TCromwellPageCoreProps; revalidate?: number }> {
        const apiClient = getRestAPIClient();
        const timestamp = Date.now();
        const childStaticProps = await getThemeStaticProps(pageName, pageGetStaticProps, context);
        const { pluginsData, pluginsSettings } = await pluginsDataFetcher(pageName, context);
        const pageConfig = await apiClient?.getPageConfig(pageName);
        const themeMainConfig = await apiClient?.getThemeMainConfig()
        const cmsConfig = await apiClient?.getCmsConfig();
        const themeCustomConfig = await apiClient?.getThemeCustomConfig();
        const pagesInfo = await apiClient?.getPagesInfo();

        const timestamp2 = Date.now();

        // if (context && context.params && context.params.slug) {
        //     pageRoute += '/' + context.params.slug;
        // }
        console.log('getStaticProps for page: ' + pageName);
        console.log('time elapsed: ' + (timestamp2 - timestamp) + 'ms')
        // console.log('pluginssData', pluginsData, 'childStaticProps', childStaticProps);
        const props: TCromwellPageCoreProps = {
            pluginsData,
            pluginsSettings,
            childStaticProps,
            pageConfig,
            cmsConfig,
            themeMainConfig,
            themeCustomConfig,
            pagesInfo
        }
        return {
            props: props,
            revalidate: 1
        }
    }
}