import { BasePageNames, TCromwellPageCoreProps, StaticPageContext } from '@cromwell/core';
import { getRestAPIClient } from '@cromwell/core-frontend';
import { getThemeStaticProps } from './getThemeStaticProps';
import { pluginsDataFetcher } from './pluginsDataFetcher';

export const createGetStaticProps = (pageName: BasePageNames | string) => {
    return async function (context: StaticPageContext): Promise<
        { props: TCromwellPageCoreProps; revalidate?: number }> {
        const apiClient = getRestAPIClient();
        const timestamp = Date.now();
        const childStaticProps = await getThemeStaticProps(pageName, context);
        const pluginsData = await pluginsDataFetcher(pageName, context);
        const pageConfig = await apiClient.getPageConfig(pageName);
        const appConfig = await apiClient.getAppConfig();
        const cmsConfig = await apiClient.getCmsConfig();
        const appCustomConfig = await apiClient.getAppCustomConfig();
        const pagesInfo = await apiClient.getPagesInfo();
        const timestamp2 = Date.now();

        // if (context && context.params && context.params.slug) {
        //     pageRoute += '/' + context.params.slug;
        // }
        console.log('getStaticProps for page: ' + pageName + ' with context: ', JSON.stringify(context));
        console.log('time elapsed: ' + (timestamp2 - timestamp) + 'ms')
        // console.log('pluginssData', pluginsData, 'childStaticProps', childStaticProps);
        return {
            props: {
                pluginsData,
                childStaticProps,
                pageConfig,
                cmsConfig,
                appConfig,
                appCustomConfig,
                pagesInfo
            },
            revalidate: process.env.isProd ? 1 : undefined
        }
    }
}