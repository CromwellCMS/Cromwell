import React from 'react';
import { CromwellBlock } from '../CromwellBlock/CromwellBlock';
import { TCromwellBlockData, getStoreItem, setStoreItem, getStore, isServer } from '@cromwell/core';
import { isValidElementType } from 'react-is';
import { getRestAPIClient } from '../../api/CRestAPIClient';
import dynamic from 'next/dynamic';
import loadable from '@loadable/component';

const fallbackComponent = () => <></>;

const getComponent = (pluginName: string) => {
    let pluginsComponents = getStoreItem('pluginsComponents');
    if (pluginsComponents?.[pluginName]) {
        return pluginsComponents[pluginName];
    }

    if (!pluginsComponents) {
        pluginsComponents = {};
        setStoreItem('pluginsComponents', pluginsComponents);
    }

    // dynamic method is available in Next.js environment (Renderer), but is not in others (Admin Panel)
    const dynamicLoader = dynamic ?? loadable;

    const restAPIClient = getRestAPIClient();
    pluginsComponents[pluginName] = dynamicLoader(async () => {
        // Get frontend bundle
        const frontendBundle = await restAPIClient?.getPluginFrontendBundle(pluginName);
        // if (frontendBundle) pluginsBundles[pluginName] = frontendBundle;
        if (!frontendBundle || !frontendBundle.source) {
            console.error('Frontend bundle of the Plugin ' + pluginName + ' was not found, but used by name');
            return fallbackComponent;
        }

        if (frontendBundle.meta) {
            const nodeModules = getStoreItem('nodeModules');
            await nodeModules?.importSciptExternals?.(frontendBundle.meta);
        }

        let comp;
        try {
            if (!isServer()) {
                const source = `
                var comp = ${frontendBundle.source};
                CromwellStore.pluginsComponents['${pluginName}'] = comp;
                `;

                await new Promise(res => {
                    const sourceBlob = new Blob([source], { type: 'text/javascript' });
                    const objectURL = URL.createObjectURL(sourceBlob);
                    const domScript = document.createElement('script');
                    domScript.src = objectURL;
                    domScript.onload = () => res();
                    document.head.appendChild(domScript);
                });
                comp = pluginsComponents![pluginName];
            } else {
                if (frontendBundle.cjsPath) {
                    const fsRequire = getStoreItem('fsRequire');
                    comp = fsRequire(frontendBundle.cjsPath).default;
                } else {
                    comp = Function('CromwellStore', `return ${frontendBundle.source}`)(getStore());
                }
                if (comp) pluginsComponents![pluginName] = comp;
            }
            if (!comp) throw new Error('!comp');
        } catch (e) {
            console.error('Failed to execute plugin: ' + pluginName, e);
            return fallbackComponent;
        }

        return comp
    });

    return pluginsComponents[pluginName];
}

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
                    PluginComponent = getComponent(name);
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