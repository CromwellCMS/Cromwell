import React from 'react';
import { PageName, CromwellPage, CromwellPageCoreProps } from "@cromwell/core";
import dynamic from "next/dynamic";
import { importPage } from '@cromwell/templates';
import { ComponentsContext, componentsCachePath, setComponentsData } from '@cromwell/core';
// let cacache;
// if (typeof window === undefined) {
//     cacache = require('cacache');
// }
const config = require('@cromwell/core/cmsconfig.json');

export const getPage = (pageName: PageName): CromwellPage => {
    const Page: any = dynamic(importPage(config.templateName, pageName));
    return function (props: CromwellPageCoreProps) {
        console.log('CromwellPageCoreProps', props);
        console.log('getPage:props.componentsData', props.componentsData);
        // if (cacache) cacache.put(componentsCachePath, 'componentsData', JSON.stringify(props.componentsData));
        setComponentsData(props.componentsData);
        return (
            <ComponentsContext.Provider value={props.componentsData} >
                {<Page {...props.childStaticProps} />}
            </ComponentsContext.Provider>
        )
    }
}