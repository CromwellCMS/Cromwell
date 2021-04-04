import { MenuItem, TextField, Tooltip } from '@material-ui/core';
import { CheckCircleOutline as CheckCircleOutlineIcon, Edit as EditIcon, Subject as SubjectIcon } from '@material-ui/icons';
import React, { useState } from 'react';

import styles from './BaseBlock.module.scss';
import { BaseMenu, TBaseMenuProps } from './BaseMenu';


export const TextBlock = (props: TBaseMenuProps) => {
    const [blockValue, setBlockValue] = useState<string | null>(
        props.block?.getData()?.text?.content ?? props.block?.props?.children as string);

    const [isEditing, setIsEditing] = useState<boolean>(false);

    const handleSetIsEditing = (isEditing: boolean) => {
        if (isEditing) setIsEditing(true);
        else {
            setIsEditing(false);
            const data = props.block?.getData();
            if (data) {
                if (!data.text) data.text = {};
                data.text.content = blockValue;
                props.modifyData?.(data);
            }
        }
    }

    return (
        <div>
            <BaseMenu
                {...props}
                icon={(
                    <Tooltip title="Text block">
                        <SubjectIcon />
                    </Tooltip>
                )}
                menuItems={(
                    <Tooltip title="Edit text">
                        <MenuItem onClick={() => {
                            handleSetIsEditing(!isEditing);
                        }}>
                            {!isEditing ? <EditIcon /> : <CheckCircleOutlineIcon />}
                        </MenuItem>
                    </Tooltip>
                )}
            />
            {isEditing ? (
                <TextField
                    value={blockValue}
                    onChange={(e) => { setBlockValue(e.target.value) }}
                    multiline
                    className={styles.textField}
                />
            ) : props?.block?.getDefaultContent()}

        </div>
    );
}