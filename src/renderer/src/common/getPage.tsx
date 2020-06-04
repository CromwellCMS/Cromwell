import React from 'react';
import { PageName, CromwellPageType, CromwellPageCoreProps } from "@cromwell/core";
import { setModulesData } from '@cromwell/core';
import { getStoreItem, setStoreItem } from "@cromwell/core";
import { DynamicIndexPage, DynamicProductPage } from '../generatedImports';
import { checkCMSConfig } from './modulesDataFetcher';
checkCMSConfig();


export const getPage = (pageName: PageName): CromwellPageType => {
    const cmsconfig = getStoreItem('cmsconfig');
    if (!cmsconfig || !cmsconfig.templateName) {
        console.log('cmsconfig', cmsconfig)
        throw new Error('getPage !cmsconfig.templateName');
    }

    let Page: any;
    if (pageName === 'index') Page = DynamicIndexPage;
    if (pageName === 'product') Page = DynamicProductPage;

    return function (props: CromwellPageCoreProps): JSX.Element {
        setModulesData(props.modulesData);
        // console.log('CromwellPageCoreProps', props);
        // console.log('getPage:props.componentsData', props.modulesData);
        return (
            <Page {...props.childStaticProps} />
        )
    }
}