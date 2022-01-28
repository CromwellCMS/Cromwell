import {
    resolvePageRoute,
    setStoreItem,
    TCmsConfig,
    TCromwellPageCoreProps,
    TDefaultPageName,
    TGetStaticProps,
    TPageCmsProps,
    TPageConfig,
    TPageInfo,
    TStaticPageContext,
    TThemeConfig,
} from '@cromwell/core';
import { getRestApiClient } from '@cromwell/core-frontend';
import { GetStaticPropsResult } from 'next';

import { getThemeStaticProps } from '../helpers/getThemeStaticProps';
import { pluginsDataFetcher, TPluginsSettings } from '../helpers/pluginsDataFetcher';
import { removeUndefined } from '../helpers/removeUndefined';

const wrapGetProps = (pageName: TDefaultPageName | string,
    originalGet: ((context: TStaticPageContext) => any) | null,
    getType: 'getServerSideProps' | 'getInitialProps' | 'getStaticProps'
): TGetStaticProps<TCromwellPageCoreProps> => {
    if (pageName === '/') pageName = 'index';
    if (pageName.startsWith('/')) pageName = pageName.slice(1, pageName.length - 1);

    const getStaticWrapper: TGetStaticProps<TCromwellPageCoreProps> = async (context) => {
        // Name to request a page config. Config will be the same for different slugs
        // of a page. There's an exception: generic pages - `pages/[slug]`, 
        // since they can be edited separately in Theme Editor
        const pageConfigName = (pageName === 'pages/[slug]' && context?.params?.slug) ?
            `pages/${context.params.slug}` : pageName;

        // const pageRoute = resolvePageRoute(pageName, { slug: context?.params?.slug + '' });
        // const timestamp = Date.now();
        let rendererData: {
            pageConfig?: TPageConfig;
            pluginsSettings?: TPluginsSettings;
            themeConfig?: TThemeConfig;
            userConfig?: TThemeConfig;
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
            themeCustomConfig, pluginsSettings, userConfig } = rendererData;

        if (themeConfig?.defaultPages) setStoreItem('defaultPages', themeConfig?.defaultPages);
        const resolvedPageRoute = resolvePageRoute(pageConfigName, { slug: context?.params?.slug as string })

        if (themeConfig) {
            themeConfig.palette = Object.assign({}, themeConfig.palette,
                userConfig?.palette);
        }

        context.pageConfig = rendererData.pageConfig;
        context.themeConfig = rendererData.themeConfig;
        context.userConfig = rendererData.userConfig;
        context.cmsSettings = rendererData.cmsSettings;
        context.themeCustomConfig = rendererData.themeCustomConfig;
        context.pagesInfo = rendererData.pagesInfo;

        const childStaticProps = await getThemeStaticProps(pageName, originalGet, context);
        const extraPlugins = childStaticProps?.extraPlugins;
        if (childStaticProps?.extraPlugins) delete childStaticProps?.extraPlugins;

        const plugins = await pluginsDataFetcher(pageConfigName, context, pluginsSettings,
            extraPlugins);

        const pluginsNextProps = Object.assign({}, ...Object.values(plugins)
            .map(plugin => plugin.nextProps).filter(Boolean));

        // const timestamp2 = Date.now();
        // console.log('getStaticProps for page: ' + pageName);
        // console.log('time elapsed: ' + (timestamp2 - timestamp) + 'ms');

        if (childStaticProps && !childStaticProps.props) childStaticProps.props = {};

        const cmsProps: TPageCmsProps = {
            plugins,
            pageConfig,
            cmsSettings,
            themeCustomConfig,
            pageConfigName,
            resolvedPageRoute,
            slug: context?.params?.slug,
            defaultPages: themeConfig?.defaultPages,
            themeHeadHtml: themeConfig?.headHtml,
            themeFooterHtml: themeConfig?.footerHtml,
            palette: themeConfig?.palette,
        }

        const pageProps: GetStaticPropsResult<TCromwellPageCoreProps> = {
            ...childStaticProps,
            ...pluginsNextProps,
            props: {
                ...(childStaticProps.props ?? {}),
                cmsProps: cmsProps
            }
        }

        if (getType === 'getStaticProps') {
            pageProps.revalidate = childStaticProps?.revalidate ?? 60;
        }

        return removeUndefined(pageProps);
    }

    return getStaticWrapper;
}

export const wrapGetStaticProps = (addExport: (name: string, content: any) => any,
    pageName: string, pageComponents: any) => {
    if (pageComponents.getInitialProps) return;
    if (pageComponents.getServerSideProps) return;

    addExport('getStaticProps', wrapGetProps(pageName,
        pageComponents.getStaticProps, 'getStaticProps'));
}

export const wrapGetInitialProps = (addExport: (name: string, content: any) => any,
    pageName: string, pageComponents: any) => {
    if (pageComponents.getInitialProps)
        addExport('getInitialProps', wrapGetProps(pageName,
            pageComponents.getInitialProps, 'getInitialProps'));
}

export const wrapGetServerSideProps = (addExport: (name: string, content: any) => any,
    pageName: string, pageComponents: any) => {
    if (pageComponents.getServerSideProps)
        addExport('getServerSideProps', wrapGetProps(pageName,
            pageComponents.getServerSideProps, 'getServerSideProps'));
}

export const wrapGetStaticPaths = (addExport: (name: string, content: any) => any,
    pageName: string, pageComponents: any) => {
    if (pageComponents.getStaticPaths)
        addExport('getStaticPaths', pageComponents.getStaticPaths)
}

export const createGetServerSideProps = (pageName: string, comps) => {
    return wrapGetProps(pageName,
        comps.getServerSideProps, 'getServerSideProps')
}

export const createGetInitialProps = (pageName: string, comps) => {
    return wrapGetProps(pageName,
        comps.getInitialProps, 'getInitialProps')
}

export const createGetStaticProps = (pageName: string, comps) => {
    return wrapGetProps(pageName,
        comps.getStaticProps, 'getStaticProps')
}

export const createGetStaticPaths = (pageName: string, comps) => {
    return comps.getStaticPaths
}