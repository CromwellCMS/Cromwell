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

        const handleRequset = async (req?: Promise<any>) => {
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
        const childStaticProps = await getThemeStaticProps(pageName, pageGetStaticProps, context);
        const { pluginsData, pluginsSettings } = await pluginsDataFetcher(pageConfigName, context);
        const pageConfig: TPageConfig | null = await handleRequset(apiClient?.getPageConfig(pageConfigName));
        const themeConfig: TThemeConfig | null = await handleRequset(apiClient?.getThemeConfig());
        const cmsSettings = await handleRequset(apiClient?.getCmsSettings());
        const themeCustomConfig = await handleRequset(apiClient?.getThemeCustomConfig());
        const pagesInfo = await handleRequset(apiClient?.getPagesInfo());

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