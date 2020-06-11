import React from 'react';
import { BasePageNames, CromwellPageType, CromwellPageCoreProps } from "@cromwell/core";
import { setModulesData } from '@cromwell/core';
import { getStoreItem } from "@cromwell/core";
import { importDynamicPage } from '../../.cromwell/gen.imports';
import { checkCMSConfig } from '../helpers/checkCMSConfig';
checkCMSConfig();


export const getPage = (pageName: BasePageNames | string): CromwellPageType => {
    const cmsconfig = getStoreItem('cmsconfig');
    if (!cmsconfig || !cmsconfig.templateName) {
        console.log('cmsconfig', cmsconfig)
        throw new Error('getPage !cmsconfig.templateName');
    }

    const Page = importDynamicPage(pageName);

    return function (props: CromwellPageCoreProps): JSX.Element {
        setModulesData(props.modulesData);
        // console.log('CromwellPageCoreProps', props);
        // console.log('getPage:props.componentsData', props.modulesData);
        return (
            <Page {...props.childStaticProps} />
        )
    }
}