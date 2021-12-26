import React from 'react';

export const withElements = <T>(Component: T, elements: any, otherProps?: any): T => {
    const hoc = (props) => {
        return React.createElement(Component as any, {
            ...(otherProps ?? {}),
            elements, ...props
        });
    };
    // @ts-ignore
    if (Component.getData) hoc.getData = Component.getData;
    return hoc as any;
}