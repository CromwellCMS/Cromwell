import { BasePageNames, setStoreItem, TCromwellPage, TCromwellPageCoreProps } from '@cromwell/core';
import { CContainer, Head, pageRootContainerId } from '@cromwell/core-frontend';
import { DomElement } from 'htmlparser2';
import React, { useRef, useState } from 'react';
import ReactHtmlParser, { Transform } from 'react-html-parser';
import { isValidElementType } from 'react-is';

function useForceUpdate() {
    const state = useState(0);
    return () => state[1](value => ++value);
}

const parserTransform: Transform = (node: DomElement) => {
    if (node.type === 'script') {
        if (node.children?.[0]?.data && node.children[0].data !== '')
            return <script dangerouslySetInnerHTML={{ __html: node.children[0].data }} />
    }
}

export const getPage = (pageName: BasePageNames | string, PageComponent: TCromwellPage): TCromwellPage => {
    if (!PageComponent) throw new Error('getPage !PageComponent');
    if (!isValidElementType(PageComponent)) throw new Error('getPage PageComponent !isValidElementType');

    if (pageName === '_app') return PageComponent;

    return function (props: Partial<TCromwellPageCoreProps>): JSX.Element {
        const { plugins, pageConfig, themeCustomConfig,
            childStaticProps, cmsSettings, themeHeadHtml,
            themeFooterHtml, pagesInfo,
            palette } = props;

        const forcedChildStaticProps = useRef(null);
        if (cmsSettings) setStoreItem('cmsSettings', cmsSettings);
        if (plugins) setStoreItem('plugins', plugins);
        if (pageConfig) setStoreItem('pageConfig', pageConfig);
        if (themeCustomConfig) setStoreItem('themeCustomConfig', themeCustomConfig);
        if (pagesInfo) setStoreItem('pagesInfo', pagesInfo);
        if (palette) setStoreItem('palette', palette);

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

        const pageCompProps = forcedChildStaticProps.current ?? childStaticProps;

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