import { getStoreItem } from '@cromwell/core';
import { BlockStoreProvider, CContainer, pageRootContainerId } from '@cromwell/core-frontend';
import { AppProps } from 'next/app';
import React from 'react';

import { patchDocument } from '../helpers/document';
import { initRenderer } from '../helpers/initRenderer';

const DefaultRootComp = ((props: any) => props.children);

export const withCromwellApp = (App: ((props: AppProps) => JSX.Element | null)) => {
    patchDocument();
    initRenderer();

    return (props: AppProps) => {
        const Page = props.Component;

        const RootComp: React.ComponentType = getStoreItem('rendererComponents')?.root ?? DefaultRootComp;
        return (
            <BlockStoreProvider value={{ instances: {} }}>
                <RootComp>
                    <CContainer id={pageRootContainerId} isConstant={true}>
                        <App {...props} Component={Page} />
                    </CContainer>
                </RootComp >
            </BlockStoreProvider>
        )
    }

}