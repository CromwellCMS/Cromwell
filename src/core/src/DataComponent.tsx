import React from 'react';
import { DataComponentProps } from './types';
import { ComponentsContext } from './ComponentsContext';
import { componentsCachePath } from './constants';
// let cacache;
// if (typeof window === undefined) {
//     cacache = require('cacache');
// }

export function DataComponent<Data>(props: DataComponentProps<Data>) {
    console.log('BaseComponent props', props);

    const Comp = props.component;
    if (!Comp) {
        const errMsg = `Component ${props.componetName} will not render. No React Component specified!`;
        console.error(errMsg);
        return <div style={{ display: 'none' }}>{errMsg}</div>
    }

    return (
        <div className="BaseComponent">
            <ComponentsContext.Consumer>
                {(componentsData) => {
                    // if (cacache) componentsData = cacache.get(componentsCachePath, 'componentsData');
                    console.log('componentsData', componentsData);
                    componentsData = getComponentsData();
                    const data = componentsData[props.componetName];
                    // if (!data) {
                    //     const errMsg = `Component ${props.componetName} will not render. No data recieved!`;
                    //     console.error(errMsg);
                    //     return <div style={{ display: 'none' }}>{errMsg}</div>
                    // }
                    return (
                        <Comp {...data} />
                    )
                }}

            </ComponentsContext.Consumer>
        </div>
    )
}

export const getComponentsData = () => {
    if (typeof window !== 'undefined') {
        return window.componentsData;
    }
    else {
        return global.componentsData;
    }
}
export const setComponentsData = (componentsData) => {
    if (typeof window !== 'undefined') {
        window.componentsData = componentsData;
    }
    else {
        global.componentsData = componentsData;
    }
}