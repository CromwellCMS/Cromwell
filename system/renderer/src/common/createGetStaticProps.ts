import {
    resolvePageRoute,
    StaticPageContext,
    TCmsConfig,
    TCromwellPageCoreProps,
    TDefaultPageName,
    TPageConfig,
    TPageInfo,
    TPageStats,
    TThemeConfig,
} from '@cromwell/core';
import { getRestAPIClient } from '@cromwell/core-frontend';

import { getThemeStaticProps } from './getThemeStaticProps';
import { pluginsDataFetcher } from './pluginsDataFetcher';

export const createGetStaticProps = (pageName: TDefaultPageName | string,
    pageGetStaticProps: ((context: StaticPageContext) => any) | undefined | null) => {
    return async function (context: StaticPageContext): Promise<
        { props: TCromwellPageCoreProps; revalidate?: number }> {

        // Name to request a page config. Config will be the same for different slugs
        // of a page except `pages/[slug]`, since they can be edited separately in Page Builder
        const pageConfigName = (pageName === 'pages/[slug]' && context?.params?.slug) ?
            `pages/${context.params.slug}` : pageName;

        const pageRoute = resolvePageRoute(pageName, { slug: context?.params?.slug + '' });
        const apiClient = getRestAPIClient();

        // const timestamp = Date.now();

        let rendererData: {
            pageConfig?: TPageConfig;
            pluginsSettings?: {
                pluginName: string;
                version?: string;
                globalSettings?: any;
            }[];
            themeConfig?: TThemeConfig;
            cmsSettings?: TCmsConfig;
            themeCustomConfig?: any;
            pagesInfo?: TPageInfo[];
        } = {};

        try {
            rendererData = (await getRestAPIClient().batchRendererData(pageConfigName)) ?? {};
        } catch (e) {
            console.error(e);
        }

        const { pageConfig, themeConfig, cmsSettings,
            themeCustomConfig, pagesInfo, pluginsSettings } = rendererData;

        const [childStaticProps, plugins] = await Promise.all([
            getThemeStaticProps(pageName, pageGetStaticProps, context),
            pluginsDataFetcher(pageConfigName, context, pluginsSettings),
        ]);

        // const timestamp2 = Date.now();

        const pageStats: TPageStats = {
            pageRoute
        }
        if (context?.params?.slug && themeConfig?.defaultPages) {
            if (pageName === themeConfig.defaultPages.product) {
                pageStats.productSlug = String(context.params.slug);
            }
            if (pageName === themeConfig.defaultPages.category) {
                pageStats.categorySlug = String(context.params.slug);
            }
            if (pageName === themeConfig.defaultPages.tag) {
                pageStats.tagSlug = String(context.params.slug);
            }
            if (pageName === themeConfig.defaultPages.post) {
                pageStats.postSlug = String(context.params.slug);
            }
        }

        apiClient?.post(`cms/view-page`, pageStats, { disableLog: true }).catch(() => null);
        // console.log('getStaticProps for page: ' + pageName);
        // console.log('time elapsed: ' + (timestamp2 - timestamp) + 'ms');

        const props: TCromwellPageCoreProps = {
            plugins,
            childStaticProps,
            pageConfig,
            cmsSettings,
            themeCustomConfig,
            pagesInfo,
            defaultPages: themeConfig?.defaultPages,
            themeHeadHtml: themeConfig?.headHtml,
            themeFooterHtml: themeConfig?.footerHtml,
            palette: themeConfig?.palette,
        }

        return {
            props: JSON.parse(JSON.stringify(props)),
            revalidate: 1
        }
    }
}
