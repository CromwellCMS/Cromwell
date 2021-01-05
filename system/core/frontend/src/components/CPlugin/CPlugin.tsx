import React from 'react';
import { isValidElementType } from 'react-is';

import { getRestAPIClient } from '../../api/CRestAPIClient';
import { loadFrontendBundle } from '../../helpers/loadFrontendBundle';
import { CromwellBlock } from '../CromwellBlock/CromwellBlock';
import { dynamicLoader } from '../../constants';

const fallbackComponent = () => <></>;

/**
 * Used internally to import and render plugin at frontend
 * @param props 
 */
export const CPlugin = (props: { id: string, className?: string, pluginName?: string }) => {
    const { pluginName, ...rest } = props;

    return (
        <CromwellBlock {...rest} type='plugin'
            content={(data) => {
                const name = (data && data.plugin && data.plugin.pluginName) ? data.plugin.pluginName : pluginName;
                let PluginComponent;
                if (name) {
                    PluginComponent = loadFrontendBundle(name, async () => {
                        const restAPIClient = getRestAPIClient();
                        return restAPIClient?.getPluginFrontendBundle(name);
                    }, dynamicLoader, fallbackComponent, { loading: () => <p>loading plugin...</p> })
                }
                // console.log('CPlugin name', name, 'PluginComponent', PluginComponent);
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