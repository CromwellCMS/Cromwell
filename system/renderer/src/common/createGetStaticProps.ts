import { BasePageNames, StaticPageContext, TCmsConfig, TPageInfo, TCromwellPageCoreProps, TPageConfig, TPageStats, TThemeConfig } from '@cromwell/core';
import { getRestAPIClient } from '@cromwell/core-frontend';

import { getThemeStaticProps } from './getThemeStaticProps';
import { pluginsDataFetcher } from './pluginsDataFetcher';


export const createGetStaticProps = (pageName: BasePageNames | string,
    pageGetStaticProps: ((context: StaticPageContext) => any) | undefined | null) => {
    return async function (context: StaticPageContext): Promise<
        { props: TCromwellPageCoreProps; revalidate?: number }> {

        const pageConfigName = (pageName === 'pages/[slug]' && context?.params?.slug) ?
            `pages/${context.params.slug}` : pageName;

        const pageRoute = context?.params?.slug ? pageName.replace('[slug]', context.params.slug + '') : pageName;
        const apiClient = getRestAPIClient();

        // const timestamp = Date.now();

        let rendererData: {
            pageConfig?: TPageConfig
            pluginsSettings?: {
                pluginName: string;
                version?: string;
                settings: any;
            }[];
            themeConfig?: TThemeConfig;
            cmsSettings?: TCmsConfig;
            themeCustomConfig?: any;
            pagesInfo?: TPageInfo[];
        } = {};

        try {
            const data = await getRestAPIClient().get(`theme/renderer?pageRoute=${pageRoute}`);
            rendererData = JSON.parse(JSON.stringify(data ?? {}));
        } catch (e) {
            console.error(e);
        }

        const { pageConfig, themeConfig, cmsSettings, themeCustomConfig, pagesInfo, pluginsSettings } = rendererData;

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

        const headHtml = themeConfig?.headHtml ?? null;
        const palette = themeConfig?.palette ?? null;

        // console.log('getStaticProps for page: ' + pageName);
        // console.log('time elapsed: ' + (timestamp2 - timestamp) + 'ms');

        return {
            props: {
                plugins,
                childStaticProps,
                pageConfig,
                cmsSettings,
                themeCustomConfig,
                pagesInfo,
                headHtml,
                palette,
            },
            revalidate: 1
        }
    }
}