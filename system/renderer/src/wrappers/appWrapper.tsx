import {
  EDBEntity,
  getStoreItem,
  isServer,
  setStoreItem,
  TCromwellPageCoreProps,
  TDefaultPageName,
  TNextDocumentContext,
  TPageStats,
} from '@cromwell/core';
import {
  AppPropsContext,
  BlockStoreProvider,
  CContainer,
  cleanParseContext,
  getAuthClient,
  getModuleImporter,
  getRestApiClient,
  pageRootContainerId,
  parseHtml,
} from '@cromwell/core-frontend';
import { AppProps } from 'next/app';
import { NextRouter } from 'next/router';
import React, { useRef } from 'react';
import { ReactNode, useEffect } from 'react';

import { CrwDocumentContext, patchDocument } from '../helpers/document';
import { useForceUpdate } from '../helpers/helpers';
import { initRenderer } from '../helpers/initRenderer';
import { usePatchForRedirects } from '../helpers/redirects';

const DefaultRootComp = (props: any) => props.children;

type TPageProps = Partial<TCromwellPageCoreProps> & {
  router?: NextRouter;
  children?: ReactNode;
};

type TAppProps = Omit<AppProps<TPageProps>, 'pageProps'> & {
  pageProps: TPageProps;
};

export const withCromwellApp = (App: (props: TAppProps) => JSX.Element | null) => {
  patchDocument();
  initRenderer();

  return (props: TAppProps) => {
    const pageInstances = useRef({});
    const Page = props.Component;
    const pageProps = props.pageProps;

    const {
      plugins,
      pageConfig,
      themeCustomConfig,
      cmsSettings,
      themeHeadHtml,
      themeFooterHtml,
      documentContext,
      palette,
      defaultPages,
      pageConfigRoute,
      resolvedPageRoute,
      slug,
    } = pageProps?.cmsProps ?? {};

    const title = pageConfig?.title;
    const description = pageConfig?.description;
    const keywords = pageConfig?.keywords?.length && pageConfig.keywords;

    const Head = getModuleImporter()?.modules?.['next/head']?.default;
    const pageId = documentContext?.fullUrl ?? (resolvedPageRoute as string);

    const RootComp: React.ComponentType<{ children?: React.ReactNode }> =
      getStoreItem('rendererComponents')?.root ?? DefaultRootComp;

    usePatchForRedirects();

    // Save CMS props
    if (cmsSettings) setStoreItem('cmsSettings', Object.assign({}, cmsSettings, getStoreItem('cmsSettings')));
    if (plugins) setStoreItem('plugins', plugins);
    if (pageConfig) setStoreItem('pageConfig', pageConfig);
    if (defaultPages) setStoreItem('defaultPages', defaultPages);
    if (themeCustomConfig) setStoreItem('themeCustomConfig', themeCustomConfig);
    if (palette) {
      const theme = getStoreItem('theme') ?? {};
      theme.palette = palette;
      setStoreItem('theme', theme);
    }

    // Set URL parameters
    if (!isServer() && documentContext) {
      if (!documentContext.fullUrl) documentContext.fullUrl = window.location.href;

      if (!documentContext.origin) documentContext.origin = window.location.origin;

      if (documentContext.origin.endsWith('/'))
        documentContext.origin = documentContext.origin.slice(0, documentContext.origin.length - 2);
    }

    const routeInfo = {
      origin: documentContext?.origin,
      fullUrl: documentContext?.fullUrl,
    };

    const forceUpdate = useForceUpdate();
    const forceUpdatePage = () => {
      forceUpdate();
    };
    setStoreItem('forceUpdatePage', forceUpdatePage);

    let favicon = cmsSettings?.favicon;
    if (favicon) {
      if (!favicon.startsWith('http')) {
        if (!favicon.startsWith('/')) favicon = '/' + favicon;
        if (documentContext?.origin) {
          favicon = documentContext.origin + favicon;
        }
      }
    }
    let faviconType;
    if (favicon) {
      if (favicon.endsWith('.png')) faviconType = 'image/png';
      if (favicon.endsWith('.ico')) faviconType = 'image/x-icon';
      if (favicon.endsWith('.jpg')) faviconType = 'image/jpeg';
      if (favicon.endsWith('.jpeg')) faviconType = 'image/jpeg';
      if (favicon.endsWith('.svg')) faviconType = 'image/svg+xml';
    }

    const getChildAppProps = (documentContext: TNextDocumentContext): TAppProps => {
      return {
        ...props,
        router: props.router,
        pageProps: {
          ...props.pageProps,
          cmsProps: {
            ...(props.pageProps?.cmsProps ?? {}),
            documentContext,
            router: props.router,
          },
        },
      };
    };

    // When URL changes make page viewed request
    useEffect(() => {
      if (!isServer()) {
        let pageDefaultName: TDefaultPageName | undefined;
        if (defaultPages) {
          Object.entries(defaultPages).forEach((entry) => {
            if (entry[1] === pageConfigRoute) pageDefaultName = entry[0] as TDefaultPageName;
          });
        }

        let entityType: EDBEntity = pageDefaultName as any;
        if (pageDefaultName === 'product') entityType = EDBEntity.Product;
        if (pageDefaultName === 'category') entityType = EDBEntity.ProductCategory;
        if (pageDefaultName === 'post') entityType = EDBEntity.Post;
        if (pageDefaultName === 'tag') entityType = EDBEntity.Tag;

        const apiClient = getRestApiClient();
        const pageStats: TPageStats = {
          pageRoute: window.location.pathname + window.location.search,
          pageName: pageConfigRoute,
          entityType,
          slug: Array.isArray(slug) ? JSON.stringify(slug) : slug,
        };
        apiClient.post(`v1/cms/view-page`, pageStats, { disableLog: true }).catch(() => null);

        getAuthClient().reviveAuth();
      }
    }, [props.router?.asPath]);

    const content = (
      <BlockStoreProvider value={{ instances: pageInstances.current }}>
        <CrwDocumentContext.Consumer>
          {(documentContext) => {
            const appProps = getChildAppProps(documentContext);
            return (
              <AppPropsContext.Provider
                value={{
                  pageProps: appProps.pageProps as TCromwellPageCoreProps,
                  router: appProps.router,
                  routeInfo,
                  forceUpdatePage,
                }}
              >
                <RootComp>
                  <Head>
                    {favicon && faviconType && <link rel="shortcut icon" type={faviconType} href={favicon} />}
                  </Head>
                  <CContainer id={pageRootContainerId} isConstant={true}>
                    <App {...appProps} Component={Page} />
                    {cmsSettings?.footerHtml && parseHtml(cmsSettings.footerHtml, { executeScripts: true })}
                    {themeFooterHtml && parseHtml(themeFooterHtml, { executeScripts: true })}
                    {pageConfig?.footerHtml && parseHtml(pageConfig.footerHtml, { executeScripts: true })}
                  </CContainer>
                  <Head>
                    {themeHeadHtml && parseHtml(themeHeadHtml)}
                    {cmsSettings?.headHtml && parseHtml(cmsSettings.headHtml)}
                    {title && (
                      <>
                        <title>{title}</title>
                        <meta property="og:title" content={title} />
                      </>
                    )}
                    {description && (
                      <>
                        <meta name="description" content={description} />
                        <meta property="og:description" content={description} />
                      </>
                    )}
                    {keywords && <meta name="keywords" content={keywords.join(',')} />}
                    {pageConfig?.headHtml && parseHtml(pageConfig?.headHtml)}
                  </Head>
                </RootComp>
              </AppPropsContext.Provider>
            );
          }}
        </CrwDocumentContext.Consumer>
      </BlockStoreProvider>
    );

    cleanParseContext(pageId);
    return content;
  };
};
