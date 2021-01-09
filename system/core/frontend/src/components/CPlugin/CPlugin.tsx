import { getStoreItem, TCromwellBlockProps, TFrontendPluginProps } from '@cromwell/core';
import React from 'react';
import { isValidElementType } from 'react-is';

import { getRestAPIClient } from '../../api/CRestAPIClient';
import { dynamicLoader } from '../../constants';
import { loadFrontendBundle } from '../../helpers/loadFrontendBundle';
import { CromwellBlock } from '../CromwellBlock/CromwellBlock';

const fallbackComponent = () => <></>;

/**
 * Used internally to import and render plugin at frontend
 * @param props 
 */
export const CPlugin = (props: {
    id: string;
    pluginName?: string;
    component?: React.ComponentType<TFrontendPluginProps>;
} & TCromwellBlockProps) => {
    const { pluginName, component, ...rest } = props;

    return (
        <CromwellBlock {...rest} type='plugin'
            content={(data) => {
                const name = data?.plugin?.pluginName ?? pluginName;
                if (!name) return <></>;

                let PluginComponent = component;
                if (name && !component) {

                    const restAPIClient = getRestAPIClient();
                    const loader = getStoreItem('environment')?.isAdminPanel ?
                        restAPIClient?.getPluginAdminBundle : restAPIClient?.getPluginFrontendBundle;

                    PluginComponent = loadFrontendBundle(
                        name,
                        async () => loader?.(name),
                        dynamicLoader,
                        fallbackComponent,
                        { loading: () => <p>loading plugin...</p> }
                    )
                }

                const pluginsData = getStoreItem('pluginsData');
                const pluginsSettings = getStoreItem('pluginsSettings');
                const pluginData = pluginsData?.[name] ?? {};
                const settings = pluginsSettings?.[name] ?? {};

                // console.log('CPlugin name', name, 'PluginComponent', PluginComponent);
                if (PluginComponent && isValidElementType(PluginComponent)) return (
                    <ErrorBoundary>
                        <PluginComponent data={pluginData} settings={settings} pluginName={name} />
                    </ErrorBoundary>
                );
                else return <></>
            }}
        />
    )
}

class ErrorBoundary extends React.Component<{}, { hasError: boolean, errorMessage: string }> {
    constructor(props) {
        super(props);
        this.state = { hasError: false, errorMessage: '' };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, errorMessage: JSON.stringify(error) };
    }

    componentDidCatch(error, errorInfo) {
        console.error(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div>
                    <h3>Plugin crashed</h3>
                    <p>{this.state.errorMessage}</p>
                </div>
            );
        }

        return this.props.children;
    }
};