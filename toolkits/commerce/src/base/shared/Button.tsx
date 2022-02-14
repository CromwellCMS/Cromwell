import React from 'react';

/** @internal */
export type TBaseButtonProps = {
    disabled?: boolean;
    className?: string;
    id?: string;
    style?: React.CSSProperties;
    onClick?: React.MouseEventHandler | undefined;
    variant?: 'outlined' | 'text' | 'contained';
    color?: 'primary';
    size?: 'small' | 'medium' | 'large';
    startIcon?: React.ReactNode;
    'aria-label'?: string;
}
/** @internal */
export type TBaseButton = React.ComponentType<TBaseButtonProps>;

/** @internal */
export const BaseButton: TBaseButton = (props) => {
    return <button
        onClick={props.onClick}
        disabled={props.disabled}
        className={props.className}
        style={props.style}
        id={props.id}
    >{props.children}</button>
}