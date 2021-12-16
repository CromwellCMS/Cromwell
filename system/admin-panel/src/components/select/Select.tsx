import { HelpOutlineOutlined } from '@mui/icons-material';
import {
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select as MuiSelect,
    SelectProps,
    Tooltip,
} from '@mui/material';
import React from 'react';
import { useHistory } from 'react-router-dom';

export function Select(props: {
    options?: ({
        value: string | number | undefined;
        label: string;
    } | string | number | undefined)[];
    selectStyle?: React.CSSProperties;
    selectClassName?: string;
    tooltipText?: string;
    tooltipLink?: string;
} & SelectProps<string | number>) {
    const history = useHistory();

    const openLink = () => {
        if (props.tooltipLink) {
            if (props.tooltipLink.startsWith('http')) {
                window.open(props.tooltipLink, '_blank');
            } else {
                history.push(props.tooltipLink);
            }
        }
    }

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
                endAdornment={(
                    (props.tooltipText || props.tooltipLink) && (
                        <InputAdornment position="end" sx={{ mr: 1 }}>
                            <Tooltip title={props.tooltipText}>
                                <IconButton onClick={openLink}>
                                    <HelpOutlineOutlined />
                                </IconButton>
                            </Tooltip>
                        </InputAdornment>
                    )
                )}
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
