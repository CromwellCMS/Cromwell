import React from 'react';
import { PageName, CromwellPageType, CromwellPageCoreProps } from "@cromwell/core";
import dynamic from "next/dynamic";
import { importPage } from '@cromwell/templates';
import { setModulesData } from '@cromwell/core';
import { getStoreItem, setStoreItem } from "@cromwell/core";
const config = require('../../cmsconfig.json');
setStoreItem('cmsconfig', config);
const cmsconfig = getStoreItem('cmsconfig');

let counter = 0;

export const getPage = (pageName: PageName): CromwellPageType => {
    if (!cmsconfig || !cmsconfig.templateName) {
        console.log('cmsconfig', cmsconfig)
        throw new Error('getPage !cmsconfig.templateName');
    }
    const Page: any = dynamic(importPage(cmsconfig.templateName, pageName));
    return function (props: CromwellPageCoreProps) {
        counter++;
        console.log('Page render: ' + pageName + ' ' + counter)
        setModulesData(props.modulesData);
        console.log('CromwellPageCoreProps', props);
        console.log('getPage:props.componentsData', props.modulesData);
        return (
            <Page {...props.childStaticProps} />
        )
    }
}