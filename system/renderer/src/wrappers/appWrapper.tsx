import { getStoreItem, TCromwellPage } from '@cromwell/core';
import { BlockStoreProvider, CContainer, pageRootContainerId } from '@cromwell/core-frontend';
import { AppProps } from 'next/app';
import React from 'react';

import { patchDocument } from '../helpers/document';
import { initRenderer } from '../helpers/initRenderer';
import { withCromwellPage } from './pageWrapper';

const DefaultRootComp = ((props: any) => props.children);
const wrappedPages: Map<any, any> = new Map();

export const withCromwellApp = (App: ((props: AppProps & { Component: TCromwellPage & { originalPage: TCromwellPage } }) => JSX.Element | null)) => {
    patchDocument();
    initRenderer();

    return (props: AppProps) => {
        const page = props.Component;

        if (!wrappedPages.get(page)) {
            const wrapped = withCromwellPage(page);
            wrapped.originalPage = page;
            wrappedPages.set(page, wrapped);
        }

        const CromwellPage = wrappedPages.get(page) ?? page;

        const RootComp: React.ComponentType = getStoreItem('rendererComponents')?.root ?? DefaultRootComp;
        return (
            <BlockStoreProvider value={{ instances: {} }}>
                <RootComp>
                    <CContainer id={pageRootContainerId} isConstant={true}>
                        <App {...props} Component={CromwellPage} />
                    </CContainer>
                </RootComp >
            </BlockStoreProvider>
        )
    }

}