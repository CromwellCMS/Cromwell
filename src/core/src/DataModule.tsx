import React from 'react';
import { DataComponentProps } from './types';

export function CromwellModule<Data>(Component: React.ComponentType<Data>, moduleName: string) {
    return () => {
        const modulesData = getModulesData();
        const data = modulesData[moduleName];
        console.log('CromwellModule moduleName', moduleName, 'data', data, 'modulesData', modulesData);
        return (
            <div className="BaseComponent">
                <Component {...data} />
            </div>
        )
    }
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