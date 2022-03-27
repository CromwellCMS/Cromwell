import { getStoreItem, TCromwellBlockProps, TFrontendPluginProps } from '@cromwell/core';
import React from 'react';
import { isValidElementType } from 'react-is';

import { getRestApiClient } from '../../api/CRestApiClient';
import { getDynamicLoader } from '../../constants';
import { getLoadableFrontendBundle } from '../../helpers/loadFrontendBundle';
import { CBlock } from '../CBlock/CBlock';

/** @internal */
const fallbackComponent = () => <></>;

type CPluginProps = {
    id: string;
    pluginName?: string;
    component?: React.ComponentType<TFrontendPluginProps>;
    adminPanel?: boolean;
} & TCromwellBlockProps & Record<string, any>;


export class CPlugin extends React.Component<CPluginProps> {
    render() {
        const props = this.props;
        const { pluginName, plugin, blockName, component, ...rest } = props;
        return (
            <CBlock {...rest} type='plugin'
                plugin={{ pluginName: pluginName ?? plugin?.pluginName }}
                content={(data, blockRef, setContentInstance) => {
                    setContentInstance(this);
                    const name = data?.plugin?.pluginName ?? pluginName ?? plugin?.pluginName;
                    const inferredBlockName = data?.plugin?.blockName ?? blockName ?? plugin?.blockName;
                    if (!name) return <></>;

                    const pluginConf = getStoreItem('plugins')?.[name];
                    const pluginData = pluginConf?.data ?? {};

                    let PluginComponent: React.ComponentType<TFrontendPluginProps> | undefined = component;
                    if (name && !component) {
                        const restAPIClient = getRestApiClient();
                        const loader = (getStoreItem('environment')?.isAdminPanel && props.adminPanel !== false) ?
                            restAPIClient?.getPluginAdminBundle : restAPIClient?.getPluginFrontendBundle;

                        PluginComponent = getLoadableFrontendBundle(
                            name,
                            async () => loader?.(name),
                            getDynamicLoader(),
                            fallbackComponent
                        ) as React.ComponentType<TFrontendPluginProps>;
                    }

                    if (PluginComponent && isValidElementType(PluginComponent)) return (
                        <ErrorBoundary>
                            <PluginComponent
                                blockId={data?.id}
                                data={pluginData}
                                pluginName={name}
                                blockName={inferredBlockName}
                                instanceSettings={data?.plugin?.instanceSettings ?? props.plugin?.instanceSettings}
                                {...props}
                            />
                        </ErrorBoundary>
                    );
                    else return <></>
                }}
            />
        )
    }
}

/** @internal */
class ErrorBoundary extends React.Component<any, { hasError: boolean, errorMessage: string }> {
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
}