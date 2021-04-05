import { htmlBlockContentClass } from '@cromwell/core-frontend';
import { MenuItem, TextField, Tooltip } from '@material-ui/core';
import { CheckCircleOutline as CheckCircleOutlineIcon, Code as CodeIcon, Edit as EditIcon } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';

import styles from './BaseBlock.module.scss';
import { BaseMenu, TBaseMenuProps } from './BaseMenu';

export function HTMLBlock(props: TBaseMenuProps) {

    const [blockValue, setBlockValue] = useState<string | null>(
        props.block?.getData()?.html?.innerHTML);

    const [isEditing, setIsEditing] = useState<boolean>(false);

    const handleSetIsEditing = (isEditing: boolean) => {
        if (isEditing) {
            setIsEditing(true);
            if (!blockValue) {
                setBlockValue(props.block?.getBlockRef()?.current?.querySelector(`.${htmlBlockContentClass}`)?.innerHTML);
            }
            props.setCanDrag(false);
        }
        else {
            setIsEditing(false);
            props.setCanDrag(true);
            const data = props.block?.getData();
            if (data) {
                if (!data.html) data.html = {};
                data.html.innerHTML = blockValue;
                props.modifyData?.(data);
            }
        }
    }

    useEffect(() => {
        return () => {
            props.setCanDrag(true);
        }
    }, []);

    return (
        <>
            <BaseMenu
                {...props}
                icon={(
                    <Tooltip title="HTML block">
                        <CodeIcon />
                    </Tooltip>
                )}
                menuItems={(
                    <Tooltip title="Edit HTML">
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
                    fullWidth
                    value={blockValue}
                    onChange={(e) => { setBlockValue(e.target.value) }}
                    multiline
                    className={styles.textField}
                />
            ) : props?.block?.getDefaultContent()}
        </>
    );
}
