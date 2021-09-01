import { TCromwellBlockData } from '@cromwell/core';
import { TextField, MenuItem, Select } from '@material-ui/core';
import React from 'react';
import ColorPicker from '../../../../components/colorPicker/ColorPicker';

export function StyleField(props: {
    dataType: 'px' | 'string' | 'color' | 'select';
    handleStyleChange: (name: keyof React.CSSProperties, value: any) => void;
    data: TCromwellBlockData;
    name: keyof React.CSSProperties;
    label: string;
    className?: string;
    style?: React.CSSProperties;
    options?: string[];
}) {
    let val = props.data?.style?.[props.name];
    if (props.dataType === 'px') {
        if (val) val = parseFloat(val);
        if (isNaN(val)) val = undefined;
    }

    let Field: React.ComponentType<any> = TextField;
    if (props.dataType === 'color') {
        Field = ColorPicker;
    }
    if (props.dataType === 'select') {
        Field = Select;
    }

    return (
        <Field
            onChange={e => {
                let value: any = e?.target?.value ?? e;
                if (props.dataType === 'px') {
                    if (value) value = parseFloat(value);
                    if (isNaN(value) || value === '' || value === null) value = undefined;
                    if (value !== undefined) value += 'px';
                }
                props.handleStyleChange(props.name, value);
            }}
            value={val ?? ''}
            className={props.className}
            type={props.dataType === 'px' ? 'number' : 'string'}
            label={props.label}
            style={props.style}
        >{props.options?.map(opt => <MenuItem value={opt} key={opt}>{opt}</MenuItem>)}</Field>
    )
}
