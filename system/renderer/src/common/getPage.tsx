import React, { useState, useRef } from 'react';
import { BasePageNames, TCromwellPage, TCromwellPageCoreProps } from "@cromwell/core";
import { getStoreItem, setStoreItem } from "@cromwell/core";
import { Head, CContainer, pageRootContainerId } from '@cromwell/core-frontend';
import { isValidElementType } from 'react-is';
import ReactHtmlParser from 'react-html-parser';

function useForceUpdate() {
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => ++value); // update the state to force render
}

export const getPage = (pageName: BasePageNames | string, PageComponent: TCromwellPage): TCromwellPage => {
    const cmsSettings = getStoreItem('cmsSettings');
    if (!cmsSettings) {
        throw new Error('getPage !cmsSettings ' + cmsSettings);
    }

    if (!PageComponent) throw new Error('getPage !PageComponent');
    if (!isValidElementType(PageComponent)) throw new Error('getPage PageComponent !isValidElementType');
    // const Page: any = importPage(pageName)?.default;

    return function (props: Partial<TCromwellPageCoreProps>): JSX.Element {
        const { pluginsData, pluginsSettings, pageConfig, themeCustomConfig, childStaticProps, cmsSettings, headHtml, pagesInfo, palette, ...restProps } = props;
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

        // Head SEO/meta/etc props:
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

        let parsedHeadHtml;
        if (headHtml && headHtml !== "") {
            parsedHeadHtml = headHtml;
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
                </CContainer>
                <Head>
                    {parsedHeadHtml && ReactHtmlParser(parsedHeadHtml)}
                    {title && <title>{title}</title>}
                    {description && <meta property="og:description" content={description} key="description" />}
                </Head>
            </>
        )
    }
}