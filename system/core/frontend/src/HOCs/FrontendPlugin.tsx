import React from 'react';
import { getStoreItem } from '@cromwell/core';


export function FrontendPlugin<Data>(Component: React.ComponentType<Data>, pluginName: string) {
    return (): JSX.Element => {
        const pluginsData = getStoreItem('pluginsData');
        const data = pluginsData ? pluginsData[pluginName] : {};
        // console.log('FrontendPlugin pluginName', pluginName, 'data', data, 'pluginsData', pluginsData);
        return (
            <Component {...data} />
        )
    }
}


