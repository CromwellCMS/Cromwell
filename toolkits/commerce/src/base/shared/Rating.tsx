import React from 'react';

export type TBaseRating = React.ComponentType<{
    disabled?: boolean;
    icon?: React.ReactNode;
    name?: string;
    max?: number;
    onChange?: (event: React.SyntheticEvent, value: number | null) => void;
    precision?: number;
    readOnly?: boolean;
    size?: 'small' | 'medium' | 'large';
    value?: number | null;
    className?: string;
    style?: React.CSSProperties;
    id?: string;
}>

export const BaseRating: TBaseRating = (props) => {
    return <div
        className={props.className}
        style={props.style}
        id={props.id}
    >{props.icon}{props.children}{props.value}</div>
}