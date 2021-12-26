import React from 'react';

export type TBaseTooltip = React.ComponentType<{
    open?: boolean;
    onOpen?: (event: React.SyntheticEvent) => void;
    enterDelay?: number;
    id?: string;
    leaveDelay?: number;
    onClose?: (event: React.SyntheticEvent | Event) => void;
    title: NonNullable<React.ReactNode>;
    className?: string;
    style?: React.CSSProperties;
    arrow?: boolean;
}>;

export const BaseTooltip: TBaseTooltip = (props) => {
    return <div
        className={props.className}
        style={props.style}
        id={props.id}
    >{props.children}</div>
}