import { Draggable } from '../../../../helpers/Draggable/Draggable';
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
                // Get block's inner HTML and filter editor's parts like DraggableFrame
                const filteredChildren: Element[] = [];

                const blockElem = props.block?.getBlockRef()?.current;
                if (blockElem?.children) {
                    Array.from(blockElem.children).forEach(child => {
                        if (!child.classList.contains(styles.menu) &&
                            !child.classList.contains(Draggable.draggableFrameClass)) {
                            filteredChildren.push(child);
                        }
                    })
                }
                setBlockValue(filteredChildren.map(child => child.outerHTML).join());
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
