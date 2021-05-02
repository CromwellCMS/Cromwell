import { BasePageNames, StaticPageContext, TCromwellPageCoreProps, TPageStats } from '@cromwell/core';
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

        const handleRequset = async <T>(req?: Promise<T>): Promise<T | null> => {
            try {
                const data = await req;
                return JSON.parse(JSON.stringify(data ?? null));
            } catch (e) {
                console.error(e);
            }
            return null;
        }

        const apiClient = getRestAPIClient();
        const timestamp = Date.now();

        const [
            childStaticProps,
            pluginsReq,
            pageConfig,
            themeConfig,
            cmsSettings,
            themeCustomConfig,
            pagesInfo,
        ] = await Promise.all([
            getThemeStaticProps(pageName, pageGetStaticProps, context),
            pluginsDataFetcher(pageConfigName, context),
            handleRequset(apiClient?.getPageConfig(pageConfigName)),
            handleRequset(apiClient?.getThemeConfig()),
            handleRequset(apiClient?.getCmsSettings()),
            handleRequset(apiClient?.getThemeCustomConfig()),
            handleRequset(apiClient?.getPagesInfo()),
        ]);

        const {
            pluginsData,
            pluginsSettings,
        } = pluginsReq;

        const timestamp2 = Date.now();

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

        handleRequset(apiClient?.post(`cms/view-page`, pageStats));

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