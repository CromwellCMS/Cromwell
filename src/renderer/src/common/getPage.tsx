import React from 'react';
import { PageName, CromwellPageType, CromwellPageCoreProps } from "@cromwell/core";
import { setModulesData } from '@cromwell/core';
import { getStoreItem, setStoreItem } from "@cromwell/core";
import { DynamicIndexPage, DynamicProductPage } from '../generatedImports';
const config = require('../../cmsconfig.json');
setStoreItem('cmsconfig', config);
const cmsconfig = getStoreItem('cmsconfig');

export const getPage = (pageName: PageName): CromwellPageType => {
    if (!cmsconfig || !cmsconfig.templateName) {
        console.log('cmsconfig', cmsconfig)
        throw new Error('getPage !cmsconfig.templateName');
    }
    let Page: any;
    if (pageName === 'index') Page = DynamicIndexPage;
    if (pageName === 'product') Page = DynamicProductPage;
    return function (props: CromwellPageCoreProps): JSX.Element {
        setModulesData(props.modulesData);
        console.log('CromwellPageCoreProps', props);
        console.log('getPage:props.componentsData', props.modulesData);
        return (
            <Page {...props.childStaticProps} />
        )
    }
}