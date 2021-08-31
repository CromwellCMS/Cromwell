import { TCromwellBlockData } from '@cromwell/core';
import { TextField } from '@material-ui/core';
import React from 'react';

export function StyleField(props: {
    dataType: 'px' | 'string';
    handleStyleChange: (name: keyof React.CSSProperties, value: any) => void;
    data: TCromwellBlockData;
    name: keyof React.CSSProperties;
    label: string;
    className?: string;
    style?: React.CSSProperties;
}) {
    let val = props.data?.style?.[props.name];
    if (props.dataType === 'px') {
        if (val) val = parseFloat(val);
        if (isNaN(val)) val = undefined;
    }
    return (
        <TextField
            onChange={e => {
                let value: any = e.target.value;
                if (props.dataType === 'px') {
                    if (value) value = parseFloat(value);
                    if (isNaN(val) || val === '' || val === null) val = undefined;
                    if (value !== undefined) value += 'px';
                }
                props.handleStyleChange(props.name, value);
            }}
            value={val ?? ''}
            className={props.className}
            type={props.dataType === 'px' ? 'number' : 'string'}
            label={props.label}
            style={props.style}
        />
    )
}
