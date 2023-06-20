import {
  removeUndefined,
  resolvePageRoute,
  setStoreItem,
  TCmsSettings,
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

const wrapGetProps = (
  pageName: TDefaultPageName | string,
  originalGet: ((context: TStaticPageContext) => any) | null,
  getType: 'getServerSideProps' | 'getInitialProps' | 'getStaticProps',
): TGetStaticProps<TCromwellPageCoreProps> => {
  if (pageName === '/') pageName = 'index';
  if (pageName.startsWith('/')) pageName = pageName.slice(1, pageName.length - 1);

  const getStaticWrapper: TGetStaticProps<TCromwellPageCoreProps> = async (context) => {
    let rendererData: {
      pageConfig?: TPageConfig;
      pluginsSettings?: TPluginsSettings;
      themeConfig?: TThemeConfig;
      userConfig?: TThemeConfig;
      cmsSettings?: TCmsSettings;
      themeCustomConfig?: any;
      pagesInfo?: TPageInfo[];
    } = {};

    if (!process.env.THEME_NAME) {
      throw new Error('Cromwell:getPropsWrapper: `THEME_NAME` was not found in process.env');
    }
    try {
      rendererData =
        (await getRestApiClient().getRendererRage(pageName, process.env.THEME_NAME, String(context?.params?.slug))) ??
        {};
    } catch (e) {
      console.error(e);
    }

    const { pageConfig, themeConfig, cmsSettings, themeCustomConfig, pluginsSettings, userConfig } = rendererData;

    const pageConfigRoute = pageConfig?.route;

    if (themeConfig?.defaultPages) setStoreItem('defaultPages', themeConfig?.defaultPages);
    const resolvedPageRoute = resolvePageRoute(pageName, { slug: context?.params?.slug as string });

    if (themeConfig) {
      themeConfig.palette = Object.assign({}, themeConfig.palette, userConfig?.palette);
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

    const plugins = await pluginsDataFetcher(pageConfigRoute, context, pluginsSettings, extraPlugins);

    const pluginsNextProps = Object.assign(
      {},
      ...Object.values(plugins)
        .map((plugin) => plugin.nextProps)
        .filter(Boolean),
    );

    if (childStaticProps && !childStaticProps.props) childStaticProps.props = {};

    const cmsProps: TPageCmsProps = {
      plugins,
      pageConfig,
      cmsSettings,
      themeCustomConfig,
      pageConfigRoute,
      resolvedPageRoute,
      slug: context?.params?.slug,
      defaultPages: themeConfig?.defaultPages,
      themeHeadHtml: themeConfig?.headHtml,
      themeFooterHtml: themeConfig?.footerHtml,
      palette: themeConfig?.palette,
    };

    const pageProps: GetStaticPropsResult<TCromwellPageCoreProps> = {
      ...childStaticProps,
      ...pluginsNextProps,
      props: {
        ...(childStaticProps.props ?? {}),
        cmsProps: cmsProps,
      },
    };

    let settingsRevalidateCacheAfter: number | undefined;

    if (typeof cmsSettings?.revalidateCacheAfter === 'number') {
      settingsRevalidateCacheAfter = cmsSettings?.revalidateCacheAfter;
    }
    if (typeof cmsSettings?.revalidateCacheAfter === 'string' && cmsSettings?.revalidateCacheAfter) {
      settingsRevalidateCacheAfter = Number(cmsSettings?.revalidateCacheAfter);
      if (isNaN(settingsRevalidateCacheAfter)) {
        settingsRevalidateCacheAfter = undefined;
      }
    }

    if (getType === 'getStaticProps') {
      pageProps.revalidate = childStaticProps?.revalidate ?? settingsRevalidateCacheAfter ?? 10;

      if (typeof pageProps.revalidate !== 'number') {
        pageProps.revalidate = 10;
      }

      if (pageProps.revalidate < 1) {
        pageProps.revalidate = 1;
      }
    }

    return removeUndefined(pageProps);
  };

  return getStaticWrapper;
};

export const wrapGetStaticProps = (
  addExport: (name: string, content: any) => any,
  pageName: string,
  pageComponents: any,
) => {
  if (pageComponents.getInitialProps) return;
  if (pageComponents.getServerSideProps) return;

  addExport('getStaticProps', wrapGetProps(pageName, pageComponents.getStaticProps, 'getStaticProps'));
};

export const wrapGetInitialProps = (
  addExport: (name: string, content: any) => any,
  pageName: string,
  pageComponents: any,
) => {
  if (pageComponents.getInitialProps)
    addExport('getInitialProps', wrapGetProps(pageName, pageComponents.getInitialProps, 'getInitialProps'));
};

export const wrapGetServerSideProps = (
  addExport: (name: string, content: any) => any,
  pageName: string,
  pageComponents: any,
) => {
  if (pageComponents.getServerSideProps)
    addExport('getServerSideProps', wrapGetProps(pageName, pageComponents.getServerSideProps, 'getServerSideProps'));
};

export const wrapGetStaticPaths = (
  addExport: (name: string, content: any) => any,
  pageName: string,
  pageComponents: any,
) => {
  if (pageComponents.getStaticPaths) addExport('getStaticPaths', pageComponents.getStaticPaths);
};

export const createGetServerSideProps = (pageName: string, comps) => {
  return wrapGetProps(pageName, comps.getServerSideProps, 'getServerSideProps');
};

export const createGetInitialProps = (pageName: string, comps) => {
  return wrapGetProps(pageName, comps.getInitialProps, 'getInitialProps');
};

export const createGetStaticProps = (pageName: string, comps) => {
  return wrapGetProps(pageName, comps.getStaticProps, 'getStaticProps');
};

export const createGetStaticPaths = (pageName: string, comps) => {
  return comps.getStaticPaths;
};
