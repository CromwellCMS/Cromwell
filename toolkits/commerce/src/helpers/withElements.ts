import React from 'react';

export const withElements = <T>(Component: T, elements: any, otherProps?: any): T => {
    const hoc = (props) => {
        return React.createElement(Component as any, {
            ...(otherProps ?? {}),
            ...props,
            elements: Object.assign({}, elements, props.elements),
        });
    };
    // @ts-ignore
    if (Component.getData) hoc.getData = Component.getData;
    return hoc as any;
}