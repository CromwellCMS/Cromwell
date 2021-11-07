import { Delete as DeleteIcon } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import React from 'react';
import { connect, PropsType } from 'react-redux-ts';

import { countSelectedItems } from '../../../../redux/helpers';
import { TAppState } from '../../../../redux/store';

const mapStateToProps = (state: TAppState) => {
    return {
        selectedItems: state.selectedItems,
        allSelected: state.allSelected,
    }
}

const DeleteSelectedButton = (props: PropsType<PropsType, {
    onClick: () => void;
    style?: React.CSSProperties;
    totalElements?: number | null;
}, ReturnType<typeof mapStateToProps>>) => {
    const enabled = countSelectedItems(props.totalElements) > 0;
    return (
        <div style={props.style}>
            <Tooltip title="Delete selected">
                <span>
                    <IconButton
                        disabled={!enabled}
                        onClick={props.onClick}
                        aria-label="Delete selected"
                    >
                        <DeleteIcon />
                    </IconButton>
                </span>
            </Tooltip>
        </div>
    );
}

export default connect(mapStateToProps)(DeleteSelectedButton);
