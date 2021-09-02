import React from 'react';
import ReactDom from 'react-dom';

import { useForceUpdate } from './forceUpdate';

export const layoutActions: {
    renderPortal?: (id: string, content: JSX.Element, target: Element) => void;
    closePortal?: (id: string) => void;
} = {};

const portalContents: Record<string, {
    content: JSX.Element;
    target: Element;
}> = {}


export const LayoutPortal = () => {
    const forceUpdate = useForceUpdate();

    layoutActions.renderPortal = (id, content, target) => {
        portalContents[id] = {
            content,
            target,
        }
        forceUpdate();
    }

    layoutActions.closePortal = (id) => {
        delete portalContents[id];
        forceUpdate();
    }

    return <>{
        Object.entries(portalContents).map(entry => {
            return (
                <React.Fragment key={entry[0]}>{ReactDom.createPortal(
                    entry[1].content,
                    entry[1].target)}</React.Fragment>
            )
        })}</>
}