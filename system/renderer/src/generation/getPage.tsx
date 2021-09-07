import {
    getStoreItem,
    isServer,
    setStoreItem,
    TCromwellPage,
    TCromwellPageCoreProps,
    TDefaultPageName,
    TPageStats,
} from '@cromwell/core';
import {
    CContainer,
    cleanParseContext,
    getModuleImporter,
    getParserTransform,
    getRestApiClient,
    pageRootContainerId,
} from '@cromwell/core-frontend';
import { NextRouter, withRouter } from 'next/router';
import React, { useRef } from 'react';
import ReactHtmlParser from 'react-html-parser';
import { isValidElementType } from 'react-is';

import { CrwDocumentContext, patchDocument } from '../helpers/document';
import { useForceUpdate } from '../helpers/helpers';
import { usePatchForRedirects } from '../helpers/redirects';

type PageProps = Partial<TCromwellPageCoreProps> & {
    router: NextRouter;
}

export const getPage = (pageName: TDefaultPageName | string, PageComponent: TCromwellPage): TCromwellPage => {
    if (!PageComponent) throw new Error('getPage !PageComponent');
    if (!isValidElementType(PageComponent)) throw new Error('getPage PageComponent !isValidElementType');

    patchDocument();
    if (pageName === '_app') return PageComponent;

    const pageComp = (props: PageProps): JSX.Element => {
        const { plugins, pageConfig, themeCustomConfig,
            childStaticProps, cmsSettings, themeHeadHtml,
            themeFooterHtml, pagesInfo, documentContext,
            palette, defaultPages, pageConfigName,
            resolvedPageRoute } = props;

        if (!isServer() && documentContext) {
            if (!documentContext.fullUrl)
                documentContext.fullUrl = window.location.href;

            if (!documentContext.origin)
                documentContext.origin = window.location.origin;

            if (!documentContext.origin.endsWith('/')) documentContext.origin = documentContext.origin + '/';
        }

        const forcedChildStaticProps = useRef(null);
        if (cmsSettings && !isServer()) setStoreItem('cmsSettings', Object.assign({}, cmsSettings, getStoreItem('cmsSettings')));
        if (plugins) setStoreItem('plugins', plugins);
        if (pageConfig) setStoreItem('pageConfig', pageConfig);
        if (defaultPages) setStoreItem('defaultPages', defaultPages);
        if (themeCustomConfig) setStoreItem('themeCustomConfig', themeCustomConfig);
        if (pagesInfo) setStoreItem('pagesInfo', pagesInfo);
        if (palette) {
            const theme = getStoreItem('theme') ?? {};
            theme.palette = palette;
            setStoreItem('theme', theme);
        }

        const forceUpdate = useForceUpdate();
        const forceUpdatePage = (forcedProps?: any) => {
            forcedChildStaticProps.current = forcedProps;
            forceUpdate();
        }
        setStoreItem('forceUpdatePage', forceUpdatePage);

        usePatchForRedirects();

        let title;
        let description;
        if (pageConfig) {
            if (pageConfig.title && pageConfig.title !== "") {
                title = pageConfig.title;
            }
            if (pageConfig.description && pageConfig.description !== "") {
                description = pageConfig.description;
            }
        }

        if (!isServer()) {
            const apiClient = getRestApiClient();
            const pageStats: TPageStats = {
                pageRoute: window.location.pathname + window.location.search,
                pageName: pageConfigName,
            }
            apiClient?.post(`v1/cms/view-page`, pageStats, { disableLog: true }).catch(() => null);
        }

        const pageCompProps = forcedChildStaticProps.current ?? childStaticProps;
        const Head = getModuleImporter()?.modules?.['next/head']?.default;
        const pageId = documentContext?.fullUrl ?? resolvedPageRoute as string;
        const parserTransform = getParserTransform(pageId);

        let favicon = cmsSettings?.favicon;
        if (favicon && favicon !== '') {
            if (!favicon.startsWith('http')) {
                if (favicon.startsWith('/')) favicon = favicon.slice(1, favicon.length);
                if (documentContext?.origin) {
                    favicon = documentContext.origin + favicon;
                }
            }
        }

        const RootComp: React.ComponentType = getStoreItem('rendererComponents')?.root ?? ((props: any) => props.children);
        const PageWrapperComp: React.ComponentType = getStoreItem('rendererComponents')?.pageWrapper ?? ((props: any) => props.children ?? <></>);

        const content = (
            <>
                <Head>
                    <meta charSet="utf-8" />
                    {favicon && (
                        <link rel="shortcut icon"
                            type={favicon.endsWith('.png') ? 'image/png' : 'image/jpg'}
                            href={favicon}
                        />
                    )}
                </Head>
                <RootComp>
                    <CContainer id={pageRootContainerId} isConstant={true}>
                        <PageWrapperComp>
                            <PageComponent {...pageCompProps} {...props} />
                        </PageWrapperComp>
                        {cmsSettings?.footerHtml && ReactHtmlParser(cmsSettings.footerHtml, { transform: parserTransform })}
                        {themeFooterHtml && ReactHtmlParser(themeFooterHtml, { transform: parserTransform })}
                        {pageConfig?.footerHtml && ReactHtmlParser(pageConfig?.footerHtml, { transform: parserTransform })}
                    </CContainer>
                </RootComp>
                <Head>
                    {themeHeadHtml && ReactHtmlParser(themeHeadHtml, { transform: parserTransform })}
                    {cmsSettings?.headHtml && ReactHtmlParser(cmsSettings.headHtml, { transform: parserTransform })}
                    {title && title !== '' && (
                        <>
                            <title>{title}</title>
                            <meta property="og:title" content={title} />
                        </>
                    )}
                    {description && description !== '' && (
                        <>
                            <meta property="description" content={description} />
                            <meta property="og:description" content={description} />
                        </>
                    )}
                    {pageConfig?.headHtml && ReactHtmlParser(pageConfig?.headHtml, { transform: parserTransform })}
                </Head>
            </>
        );
        cleanParseContext(pageId);
        return content;
    }


    const HocComp = withRouter(pageComp);

    return (props: PageProps) => (<CrwDocumentContext.Consumer>
        {value => <HocComp {...props} documentContext={value} />}
    </CrwDocumentContext.Consumer>)
}