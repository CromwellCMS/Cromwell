import React from 'react';
import { BasePageNames, CromwellPageType, CromwellPageCoreProps } from "@cromwell/core";
import { getStoreItem, setStoreItem } from "@cromwell/core";
import { importDynamicPage } from '.cromwell/imports/gen.imports';
import { checkCMSConfig } from '../helpers/checkCMSConfig';
checkCMSConfig();


export const getPage = (pageName: BasePageNames | string): CromwellPageType => {
    const cmsconfig = getStoreItem('cmsconfig');
    if (!cmsconfig || !cmsconfig.templateName) {
        console.log('cmsconfig', cmsconfig)
        throw new Error('getPage !cmsconfig.templateName');
    }

    const Page: any = importDynamicPage(pageName);

    return function (props: CromwellPageCoreProps): JSX.Element {
        setStoreItem('modulesData', props.modulesData);
        setStoreItem('blocksData', props.cromwellBlocksData);
        // console.log('CromwellPageCoreProps pageName', pageName, 'props', props);
        return (
            <Page {...props.childStaticProps} />
        )
    }
}