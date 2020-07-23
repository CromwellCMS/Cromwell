import { BasePageNames, TCromwellPageCoreProps, StaticPageContext } from '@cromwell/core';
import { getRestAPIClient } from '@cromwell/core-frontend';
import { getThemeStaticProps } from './getThemeStaticProps';
import { pluginsDataFetcher } from './pluginsDataFetcher';

export const createGetStaticProps = (pageName: BasePageNames | string) => {
    return async function (context: StaticPageContext): Promise<
        { props: TCromwellPageCoreProps; unstable_revalidate?: number }> {
        const timestamp = Date.now();
        const childStaticProps = await getThemeStaticProps(pageName, context);
        const pluginsData = await pluginsDataFetcher(pageName, context);
        const pageConfig = await getRestAPIClient().getPageConfig(pageName);
        const appConfig = await getRestAPIClient().getAppConfig();
        const appCustomConfig = await getRestAPIClient().getAppCustomConfig();
        const pagesInfo = await getRestAPIClient().getPagesInfo();
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
                appConfig,
                appCustomConfig,
                pagesInfo
            },
            /* eslint-disable @typescript-eslint/camelcase */
            unstable_revalidate: process.env.isProd ? 1 : undefined
        }
    }
}