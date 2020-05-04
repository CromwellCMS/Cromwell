import React, { Component, ComponentProps } from 'react';
import { PageName } from './types';
import dynamic from "next/dynamic";
const config = require('../../cmsconfig.json');

export const BaseComponent = (props: Props) => {
    console.log('BaseComponent props', props);

    const Comp = dynamic<ComponentProps<any>>(import(`../../../templates/${config.templateName}/src/components/${props.componetName}`));
    const data = props.componentsData[props.componetName];
    if (!Comp) {
        const errMsg = `Component ${props.componetName} will not render. No React Component specified!`;
        console.error(errMsg);
        return <div style={{ display: 'none' }}>{errMsg}</div>
    }
    if (!data) {
        const errMsg = `Component ${props.componetName} will not render. No data recieved!`;
        console.error(errMsg);
        return <div style={{ display: 'none' }}>{errMsg}</div>
    }

    return (
        <div className="BaseComponent">
            <Comp data={data} />
        </div>
    )
}

type Props = {
    componetName: string;
    pageName: PageName;
    componentsData: any;
}
