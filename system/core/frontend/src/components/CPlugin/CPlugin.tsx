import React from 'react';
import { CromwellBlock } from '../CromwellBlock/CromwellBlock';
import { TCromwellBlockData, getStoreItem } from '@cromwell/core';
import { isValidElementType } from 'react-is';

/**
 * Used internally to import and render plugin at frontend
 * @param props 
 */
export const CPlugin = (props: { id: string, className?: string, pluginName?: string }) => {
    const { pluginName, ...rest } = props;
    return (
        <CromwellBlock {...rest} type='image'
            content={(data) => {
                const name = (data && data.plugin && data.plugin.pluginName) ? data.plugin.pluginName : pluginName;
                let PluginComponent;
                if (name) {
                    const importDynamicPlugin = getStoreItem('importDynamicPlugin');
                    if (importDynamicPlugin) {
                        PluginComponent = importDynamicPlugin(name);
                    }
                }
                if (PluginComponent && isValidElementType(PluginComponent)) return (
                    <ErrorBoundary>
                        <PluginComponent />
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
