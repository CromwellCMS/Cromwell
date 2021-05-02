import { BasePageNames, getStoreItem, setStoreItem, TCromwellPage, TCromwellPageCoreProps } from '@cromwell/core';
import { CContainer, Head, pageRootContainerId } from '@cromwell/core-frontend';
import { DomElement } from 'htmlparser2';
import React, { useRef, useState } from 'react';
import ReactHtmlParser, { Transform } from 'react-html-parser';
import { isValidElementType } from 'react-is';

function useForceUpdate() {
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => ++value); // update the state to force render
}

const parserTransform: Transform = (node: DomElement, index: number) => {
    if (node.type === 'script') {
        if (node.children?.[0]?.data && node.children[0].data !== '')
            return <script dangerouslySetInnerHTML={{ __html: node.children[0].data }} />
    }
}

export const getPage = (pageName: BasePageNames | string, PageComponent: TCromwellPage): TCromwellPage => {
    const cmsSettings = getStoreItem('cmsSettings');
    if (!cmsSettings) {
        throw new Error('getPage !cmsSettings ' + cmsSettings);
    }

    if (!PageComponent) throw new Error('getPage !PageComponent');
    if (!isValidElementType(PageComponent)) throw new Error('getPage PageComponent !isValidElementType');

    if (pageName === '_app') return PageComponent;

    return function (props: Partial<TCromwellPageCoreProps>): JSX.Element {
        const { pluginsData, pluginsSettings, pageConfig, themeCustomConfig,
            childStaticProps, cmsSettings, headHtml, pagesInfo,
            palette, ...restProps } = props;

        const forcedChildStaticProps = useRef(null);
        if (cmsSettings) setStoreItem('cmsSettings', cmsSettings);
        if (pluginsData) setStoreItem('pluginsData', pluginsData);
        if (pluginsSettings) setStoreItem('pluginsSettings', pluginsSettings);
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

        // console.log('getPage: TCromwellPageCoreProps pageName', pageName, 'props', props);
        return (
            <>
                <Head>
                    <meta charSet="utf-8" />
                </Head>
                <CContainer id={pageRootContainerId} isConstant={true}>
                    <PageComponent {...pageCompProps} {...props} />
                    {cmsSettings?.footerHtml && ReactHtmlParser(cmsSettings.footerHtml, { transform: parserTransform })}
                </CContainer>
                <Head>
                    {headHtml && ReactHtmlParser(headHtml, { transform: parserTransform })}
                    {cmsSettings?.headerHtml && ReactHtmlParser(cmsSettings.headerHtml, { transform: parserTransform })}
                    {title && <title>{title}</title>}
                    {description && <meta property="og:description" content={description} key="description" />}
                </Head>
            </>
        )
    }
}