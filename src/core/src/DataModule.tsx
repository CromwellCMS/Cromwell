import React from 'react';
import { setStoreItem, getStoreItem } from './GlobalStore';

export const getModulesData = (): Record<string, any> | undefined => getStoreItem('modulesData');
export const setModulesData = (modulesData: Record<string, any>): void => setStoreItem('modulesData', modulesData);

export function CromwellModule<Data>(Component: React.ComponentType<Data>, moduleName: string) {
    return (): JSX.Element => {
        const modulesData = getModulesData();
        const data = modulesData ? modulesData[moduleName] : {};
        // console.log('CromwellModule moduleName', moduleName, 'data', data, 'modulesData', modulesData);
        return (
            <div className="BaseComponent">
                <Component {...data} />
            </div>
        )
    }
}


