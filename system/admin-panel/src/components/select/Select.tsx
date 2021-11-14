import { FormControl, InputLabel, MenuItem, Select as MuiSelect, SelectProps } from '@mui/material';
import React from 'react';

export function Select(props: {
    options?: ({
        value: string | number | undefined;
        label: string;
    } | string | number | undefined)[];
    selectStyle?: React.CSSProperties;
    selectClassName?: string;
} & SelectProps<string | number>) {
    return (
        <FormControl
            fullWidth={props.fullWidth}
            style={props.style}
            className={props.className}
        >
            <InputLabel style={props.variant === 'standard' ? {
                marginLeft: '-15px',
                marginTop: '8px',
            } : undefined}
            >{props.label}</InputLabel>
            <MuiSelect
                {...props}
                className={props.selectClassName}
                style={props.selectStyle}
            >
                {props.options?.map((option) => {
                    const label = typeof option === 'object' ? option.label : option;
                    const value = typeof option === 'object' ? option.value : option;
                    return (
                        <MenuItem value={value} key={value + ''}>{label}</MenuItem>
                    )
                })}
            </MuiSelect>
        </FormControl>
    )
}
