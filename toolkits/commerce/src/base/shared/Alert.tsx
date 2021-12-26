import React from 'react';

export type TBaseAlert = React.ComponentType<{
    severity?: 'success' | 'info' | 'warning' | 'error';
    className?: string;
    id?: string;
    style?: React.CSSProperties;
}>;

export const BaseAlert: TBaseAlert = (props) => {
    return <div
        className={props.className}
        style={props.style}
        id={props.id}
    >{props.children}</div>
}