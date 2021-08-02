import { IconButton, InputAdornment, TextField, TextFieldProps, Tooltip } from '@material-ui/core';
import { HelpOutlineOutlined } from '@material-ui/icons';
import React from 'react';
import { useHistory } from 'react-router-dom';

export default function TextFieldWithTooltip(props: TextFieldProps & {
    tooltipText?: string;
    tooltipLink?: string;
}) {
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
        <TextField
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <Tooltip title={props.tooltipText}>
                            <IconButton onClick={openLink}>
                                <HelpOutlineOutlined />
                            </IconButton>
                        </Tooltip>
                    </InputAdornment>
                ),
            }}
            {...props}
        />
    )
}
