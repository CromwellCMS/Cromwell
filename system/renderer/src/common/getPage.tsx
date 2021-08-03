import {
    getStoreItem,
    isServer,
    setStoreItem,
    TCromwellPage,
    TCromwellPageCoreProps,
    TDefaultPageName,
    TPageStats,
} from '@cromwell/core';
import { CContainer, getRestAPIClient, pageRootContainerId } from '@cromwell/core-frontend';
import { getModuleImporter } from '@cromwell/utils/build/importer.js';
import React, { useRef, useState } from 'react';
import ReactHtmlParser, { Transform } from 'react-html-parser';
import { isValidElementType } from 'react-is';

function useForceUpdate() {
    const state = useState(0);
    return () => state[1](value => ++value);
}

let index = 0;
const parserTransform: Transform = (node) => {
    index++;
    if (node.type === 'script') {
        if (node.children?.[0]?.data && node.children[0].data !== '')
            return <script key={index} dangerouslySetInnerHTML={{ __html: node.children[0].data }} />
    }
    if (node.type === 'style') {
        if (node.children?.[0]?.data && node.children[0].data !== '')
            return <style key={index} type="text/css" dangerouslySetInnerHTML={{ __html: node.children[0].data }} />
    }
}

export const getPage = (pageName: TDefaultPageName | string, PageComponent: TCromwellPage): TCromwellPage => {
    if (!PageComponent) throw new Error('getPage !PageComponent');
    if (!isValidElementType(PageComponent)) throw new Error('getPage PageComponent !isValidElementType');

    if (pageName === '_app') return PageComponent;

    return function (props: Partial<TCromwellPageCoreProps>): JSX.Element {
        const { plugins, pageConfig, themeCustomConfig,
            childStaticProps, cmsSettings, themeHeadHtml,
            themeFooterHtml, pagesInfo,
            palette, defaultPages, pageConfigName } = props;

        const forcedChildStaticProps = useRef(null);
        if (cmsSettings) setStoreItem('cmsSettings', cmsSettings);
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
            const apiClient = getRestAPIClient();
            const pageStats: TPageStats = {
                pageRoute: window.location.pathname + window.location.search,
                pageName: pageConfigName,
            }
            apiClient?.post(`v1/cms/view-page`, pageStats, { disableLog: true }).catch(() => null);
        }

        const pageCompProps = forcedChildStaticProps.current ?? childStaticProps;
        const Head = getModuleImporter()?.modules?.['next/head'];

        return (
            <>
                <Head>
                    <meta charSet="utf-8" />
                </Head>
                <CContainer id={pageRootContainerId} isConstant={true}>
                    <PageComponent {...pageCompProps} {...props} />
                    {cmsSettings?.footerHtml && ReactHtmlParser(cmsSettings.footerHtml, { transform: parserTransform })}
                    {themeFooterHtml && ReactHtmlParser(themeFooterHtml, { transform: parserTransform })}
                    {pageConfig?.footerHtml && ReactHtmlParser(pageConfig?.footerHtml, { transform: parserTransform })}
                </CContainer>
                <Head>
                    {themeHeadHtml && ReactHtmlParser(themeHeadHtml, { transform: parserTransform })}
                    {cmsSettings?.headHtml && ReactHtmlParser(cmsSettings.headHtml, { transform: parserTransform })}
                    {pageConfig?.headHtml && ReactHtmlParser(pageConfig?.headHtml, { transform: parserTransform })}
                    {title && <title>{title}</title>}
                    {description && <meta property="og:description" content={description} key="description" />}
                </Head>
            </>
        )
    }
}