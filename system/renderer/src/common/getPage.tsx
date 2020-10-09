import React, { useState } from 'react';
import { BasePageNames, TCromwellPage, TCromwellPageCoreProps } from "@cromwell/core";
import { getStoreItem, setStoreItem } from "@cromwell/core";
import { Head } from '@cromwell/core-frontend';
import ReactHtmlParser from 'react-html-parser';

function useForceUpdate() {
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => ++value); // update the state to force render
}

export const getPage = (pageName: BasePageNames | string, PageComponent: React.ComponentType): TCromwellPage => {
    const cmsconfig = getStoreItem('cmsconfig');
    if (!cmsconfig || !cmsconfig.themeName) {
        console.log('cmsconfig', cmsconfig)
        throw new Error('getPage !cmsconfig.themeName');
    }

    // const Page: any = importPage(pageName)?.default;

    return function (props: Partial<TCromwellPageCoreProps>): JSX.Element {
        const { pluginsData, pluginsSettings, pageConfig, appCustomConfig, childStaticProps, cmsConfig, appConfig, pagesInfo, ...restProps } = props;
        if (cmsConfig) setStoreItem('cmsconfig', cmsConfig);
        if (pluginsData) setStoreItem('pluginsData', pluginsData);
        if (pluginsSettings) setStoreItem('pluginsSettings', pluginsSettings);
        if (pageConfig) setStoreItem('pageConfig', pageConfig);
        if (appConfig) setStoreItem('appConfig', appConfig);
        if (appCustomConfig) setStoreItem('appCustomConfig', appCustomConfig);
        if (pagesInfo) setStoreItem('pagesInfo', pagesInfo);

        const forceUpdate = useForceUpdate();
        const forceUpdatePage = () => {
            forceUpdate();
        }
        setStoreItem('forceUpdatePage', forceUpdatePage);

        // Head SEO/meta/etc props:
        let title;
        let description;
        let headHtml;
        if (pageConfig) {
            if (pageConfig.title && pageConfig.title !== "") {
                title = pageConfig.title;
            }
            if (pageConfig.description && pageConfig.description !== "") {
                description = pageConfig.description;
            }
        }
        if (appConfig) {
            if (appConfig.headHtml && appConfig.headHtml !== "") {
                headHtml = appConfig.headHtml;
            }
        }

        // console.log('getPage: TCromwellPageCoreProps pageName', pageName, 'props', props);
        return (
            <>
                <Head>
                    <meta charSet="utf-8" />
                </Head>
                <PageComponent {...childStaticProps} {...restProps} />
                <Head>
                    {headHtml && ReactHtmlParser(headHtml)}
                    {title && <title>{title}</title>}
                    {description && <meta property="og:description" content={description} key="description" />}
                </Head>
            </>
        )
    }
}