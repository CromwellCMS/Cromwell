import { BasePageNames, TCromwellPageCoreProps, StaticPageContext, TThemeConfig, TPageConfig } from '@cromwell/core';
import { getRestAPIClient } from '@cromwell/core-frontend';
import { getThemeStaticProps } from './getThemeStaticProps';
import { pluginsDataFetcher } from './pluginsDataFetcher';

export const createGetStaticProps = (pageName: BasePageNames | string,
    pageGetStaticProps: ((context: StaticPageContext) => any) | undefined | null) => {
    return async function (context: StaticPageContext): Promise<
        { props: TCromwellPageCoreProps; revalidate?: number }> {

        const pageConfigName = (pageName === 'pages/[slug]' && context?.params?.slug) ?
            `pages/${context.params.slug}` : pageName;

        const serialize = (data: any) => JSON.parse(JSON.stringify(data ?? null));

        const apiClient = getRestAPIClient();
        const timestamp = Date.now();
        const childStaticProps = await getThemeStaticProps(pageName, pageGetStaticProps, context);
        const { pluginsData, pluginsSettings } = await pluginsDataFetcher(pageConfigName, context);
        const pageConfig: TPageConfig | null = serialize(await apiClient?.getPageConfig(pageConfigName));
        const themeConfig: TThemeConfig | null = serialize(await apiClient?.getThemeConfig());
        const cmsSettings = serialize(await apiClient?.getCmsSettings());
        const themeCustomConfig = serialize(await apiClient?.getThemeCustomConfig());
        const pagesInfo = serialize(await apiClient?.getPagesInfo());

        const timestamp2 = Date.now();

        const headHtml = themeConfig?.headHtml ?? null;
        const palette = themeConfig?.palette ?? null;

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