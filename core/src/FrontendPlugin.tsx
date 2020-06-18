import React from 'react';
import { getStoreItem } from './GlobalStore';


export function FrontendPlugin<Data>(Component: React.ComponentType<Data>, pluginName: string) {
    return (): JSX.Element => {
        const pluginsData = getStoreItem('pluginsData');
        const data = pluginsData ? pluginsData[pluginName] : {};
        // console.log('FrontendPlugin pluginName', pluginName, 'data', data, 'pluginsData', pluginsData);
        return (
            <div className={`FrontendPlugin FrontendPlugin__${pluginName}`}>
                <Component {...data} />
            </div>
        )
    }
}


