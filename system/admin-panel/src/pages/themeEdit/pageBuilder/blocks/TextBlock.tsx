import { MenuItem, TextField, Tooltip } from '@material-ui/core';
import { CheckCircleOutline as CheckCircleOutlineIcon, Edit as EditIcon, Subject as SubjectIcon } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';

import { useForceUpdate } from '../../../../helpers/forceUpdate';
import styles from './BaseBlock.module.scss';
import { BaseMenu, TBaseMenuProps } from './BaseMenu';


export const TextBlock = (props: TBaseMenuProps) => {
    const data = props.block?.getData();
    const [blockValue, setBlockValue] = useState<string | null>(
        props.block?.getData()?.text?.content ?? props.block?.props?.children as string);

    const forceUpdate = useForceUpdate();
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const handleSetIsEditing = (isEditing: boolean) => {
        if (isEditing) {
            setIsEditing(true);
            props.setCanDrag(false);
        }
        else {
            props.setCanDrag(true);
            setIsEditing(false);
            const data = props.block?.getData();
            if (data) {
                if (!data.text) data.text = {};
                data.text.content = blockValue;
                props.modifyData?.(data);
            }
        }
    }

    useEffect(() => {
        return () => {
            props.setCanDrag(true);
        }
    }, []);

    const handleChangeLink = (value: string) => {
        const data = props.block?.getData();
        if (!data.text) data.text = {};
        if (!value || value === '') value = undefined;
        data.text.href = value;

        props.modifyData?.(data);
        forceUpdate();
        props.block!.rerender();
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
                settingsContent={(
                    <div>
                        <TextField
                            fullWidth
                            onChange={(e) => handleChangeLink(e.target.value)}
                            value={data?.text?.href ?? ''}
                            className={styles.settingsInput}
                            label="Link" />
                    </div>
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

        </div>
    );
}