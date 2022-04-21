import { TCromwellBlockData } from '@cromwell/core';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React from 'react';

import { ColorPicker } from '../../../../components/colorPicker/ColorPicker';
import { TBlockMenuProps } from '../blocks/BlockMenu';

export function StyleField(props: {
    dataType: 'px' | 'string' | 'color' | 'select';
    handleStyleChange: (name: keyof React.CSSProperties, value: any) => void;
    blockProps: TBlockMenuProps;
    data: TCromwellBlockData;
    name: keyof React.CSSProperties;
    label: string;
    className?: string;
    style?: React.CSSProperties;
    options?: string[];
}) {
    const { blockProps, name, data } = props;
    const cssName = name.replace(/([A-Z0-9])/g, '-$1').toLowerCase();
    let val = props.data?.style?.[name];

    if (!val) {
        const elem = blockProps.getBlockElementById(data.id);
        const compStyles = window.getComputedStyle(elem);
        val = compStyles.getPropertyValue(cssName);
    }

    if (props.dataType === 'px') {
        if (val) val = parseFloat(val);
        if (isNaN(val)) val = undefined;
    }

    let noWrapper = true;
    let Field: React.ComponentType<any> = TextField;
    if (props.dataType === 'color') {
        Field = ColorPicker;
    }
    if (props.dataType === 'select') {
        Field = Select;
        noWrapper = false;
    }

    let content = (
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
            variant="standard"
            value={val ?? ''}
            type={props.dataType === 'px' ? 'number' : 'string'}
            label={noWrapper ? props.label : undefined}
            className={noWrapper ? props.className : undefined}
            style={noWrapper ? props.style : undefined}
        >{props.options?.map(opt => <MenuItem value={opt} key={opt}>{opt}</MenuItem>)}</Field>
    );

    if (props.dataType === 'select') {
        content = (
            <FormControl
                className={props.className}
                style={props.style}
            >
                <InputLabel>{props.label}</InputLabel>
                {content}
            </FormControl>
        )
    }

    return content;
}
