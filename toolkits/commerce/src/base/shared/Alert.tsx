import React from 'react';

export type TBaseAlertProps = {
    severity?: 'success' | 'info' | 'warning' | 'error';
    className?: string;
    id?: string;
    style?: React.CSSProperties;
}
export type TBaseAlert = React.ComponentType<TBaseAlertProps>;

export const BaseAlert: TBaseAlert = (props) => {
    return <div
        className={props.className}
        style={props.style}
        id={props.id}
    >{props.children}</div>
}