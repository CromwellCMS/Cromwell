import React from 'react';
import { DataComponentProps } from './types';

export function DataModule<Data>(props: DataComponentProps<Data>) {
    console.log('DataModule props', props);

    const Comp = props.component;
    if (!Comp) {
        const errMsg = `Module ${props.moduleName} will not render. No React Component specified!`;
        console.error(errMsg);
        return <div style={{ display: 'none' }}>{errMsg}</div>
    }
    const modulesData = getModulesData();
    const data = modulesData[props.moduleName];
    return (
        <div className="BaseComponent">
            <Comp {...data} />
        </div>
    )
}

export const getModulesData = (): Object => {
    if (typeof window !== 'undefined') {
        if (!window.cromwellData) {
            window.cromwellData = {
                modulesData: {}
            }
        }
        return window.cromwellData.modulesData;
    }
    else {
        if (!global.cromwellData) {
            global.cromwellData = {
                modulesData: {}
            }
        }
        return global.cromwellData.modulesData;
    }
}
export const setModulesData = (modulesData: Object): void => {
    if (typeof window !== 'undefined') {
        if (!window.cromwellData) {
            window.cromwellData = {
                modulesData: {}
            }
        }
        window.cromwellData.modulesData = modulesData;
    }
    else {
        if (!global.cromwellData) {
            global.cromwellData = {
                modulesData: {}
            }
        }
        global.cromwellData.modulesData = modulesData;
    }
}