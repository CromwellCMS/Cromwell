import React from 'react';
import { getStoreItem, TFrontendPluginProps } from '@cromwell/core';


export function FrontendPlugin<TData>(Component: React.ComponentType<TFrontendPluginProps<TData>>, pluginName: string) {
    return (): JSX.Element => {
        const pluginsData = getStoreItem('pluginsData');
        const pluginsSettings = getStoreItem('pluginsSettings');
        const data = pluginsData ? pluginsData[pluginName] : {};
        const settings = pluginsSettings ? pluginsSettings[pluginName] : {};
        // console.log('FrontendPlugin pluginName', pluginName, 'data', data, 'pluginsData', pluginsData);
        return (
            <Component data={data} settings={settings} />
        )
    }
}


