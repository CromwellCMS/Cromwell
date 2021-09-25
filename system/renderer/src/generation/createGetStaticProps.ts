import {
    resolvePageRoute,
    setStoreItem,
    TCmsConfig,
    TCromwellPageCoreProps,
    TDefaultPageName,
    TPageConfig,
    TPageInfo,
    TStaticPageContext,
    TThemeConfig,
} from '@cromwell/core';
import { getRestApiClient } from '@cromwell/core-frontend/dist/api/CRestApiClient';

import { getThemeStaticProps } from './getThemeStaticProps';
import { pluginsDataFetcher } from './pluginsDataFetcher';

export const createGetStaticProps = (pageName: TDefaultPageName | string,
    pageGetStaticProps: ((context: TStaticPageContext) => any) | undefined | null) => {
    return async function (context: TStaticPageContext): Promise<
        {
            props?: TCromwellPageCoreProps;
            revalidate?: number;
            notFound?: boolean;
            redirect?: any;
        }> {

        // Name to request a page config. Config will be the same for different slugs
        // of a page. There's an exception: generic pages - `pages/[slug]`, 
        // since they can be edited separately in Theme Editor
        const pageConfigName = (pageName === 'pages/[slug]' && context?.params?.slug) ?
            `pages/${context.params.slug}` : pageName;

        // const pageRoute = resolvePageRoute(pageName, { slug: context?.params?.slug + '' });
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
            rendererData = (await getRestApiClient().getRendererRage(pageConfigName)) ?? {};
        } catch (e) {
            console.error(e);
        }

        const { pageConfig, themeConfig, cmsSettings,
            themeCustomConfig, pluginsSettings } = rendererData;

        if (themeConfig?.defaultPages) setStoreItem('defaultPages', themeConfig?.defaultPages);
        const resolvedPageRoute = resolvePageRoute(pageConfigName, { slug: context?.params?.slug as string })

        context.pageConfig = rendererData.pageConfig;
        context.themeConfig = rendererData.themeConfig;
        context.cmsSettings = rendererData.cmsSettings;
        context.themeCustomConfig = rendererData.themeCustomConfig;
        context.pagesInfo = rendererData.pagesInfo;
        const [childStaticProps, plugins] = await Promise.all([
            getThemeStaticProps(pageName, pageGetStaticProps, context),
            pluginsDataFetcher(pageConfigName, context, pluginsSettings),
        ]);

        // const timestamp2 = Date.now();
        // console.log('getStaticProps for page: ' + pageName);
        // console.log('time elapsed: ' + (timestamp2 - timestamp) + 'ms');

        const props: TCromwellPageCoreProps = {
            plugins,
            childStaticProps,
            pageConfig,
            cmsSettings,
            themeCustomConfig,
            pageConfigName,
            resolvedPageRoute,
            defaultPages: themeConfig?.defaultPages,
            themeHeadHtml: themeConfig?.headHtml,
            themeFooterHtml: themeConfig?.footerHtml,
            palette: themeConfig?.palette,
        }

        return {
            props: JSON.parse(JSON.stringify(props)),
            revalidate: childStaticProps?.revalidate ?? 60,
            notFound: childStaticProps?.notFound ? true : undefined,
            redirect: childStaticProps?.redirect,
        }
    }
}
