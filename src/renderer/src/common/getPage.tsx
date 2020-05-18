import React from 'react';
import { PageName, CromwellPageType, CromwellPageCoreProps } from "@cromwell/core";
import dynamic from "next/dynamic";
import { importPage } from '@cromwell/templates';
import { setModulesData } from '@cromwell/core';
const config = require('@cromwell/core/cmsconfig.json');

export const getPage = (pageName: PageName): CromwellPageType => {
    const Page: any = dynamic(importPage(config.templateName, pageName));
    return function (props: CromwellPageCoreProps) {
        setModulesData(props.modulesData);
        console.log('CromwellPageCoreProps', props);
        console.log('getPage:props.componentsData', props.modulesData);
        return (
            <Page {...props.childStaticProps} />
        )
    }
}