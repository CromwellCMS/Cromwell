import { BasePageNames, TCromwellPageCoreProps, StaticPageContext, TThemeConfig } from '@cromwell/core';
import { getRestAPIClient } from '@cromwell/core-frontend';
import { getThemeStaticProps } from './getThemeStaticProps';
import { pluginsDataFetcher } from './pluginsDataFetcher';

export const createGetStaticProps = (pageName: BasePageNames | string,
    pageGetStaticProps: ((context: StaticPageContext) => any) | undefined | null) => {
    return async function (context: StaticPageContext): Promise<
        { props: TCromwellPageCoreProps; revalidate?: number }> {

        const serialize = (data: any) => JSON.parse(JSON.stringify(data ?? null));

        const apiClient = getRestAPIClient();
        const timestamp = Date.now();
        const childStaticProps = await getThemeStaticProps(pageName, pageGetStaticProps, context);
        const { pluginsData, pluginsSettings } = await pluginsDataFetcher(pageName, context);
        const pageConfig = serialize(await apiClient?.getPageConfig(pageName));
        const themeConfig: TThemeConfig | null = serialize(await apiClient?.getThemeConfig());
        const cmsSettings = serialize(await apiClient?.getCmsSettings());
        const themeCustomConfig = serialize(await apiClient?.getThemeCustomConfig());
        const pagesInfo = serialize(await apiClient?.getPagesInfo());

        const timestamp2 = Date.now();

        const headHtml = themeConfig?.headHtml ?? null;
        const palette = themeConfig?.palette ?? null;

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
            cmsSettings,
            themeCustomConfig,
            pagesInfo,
            headHtml,
            palette,
        }
        return {
            props: props,
            revalidate: 1
        }
    }
}