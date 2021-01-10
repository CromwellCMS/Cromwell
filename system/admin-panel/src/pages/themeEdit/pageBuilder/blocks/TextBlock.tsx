import { MenuItem, TextField, Tooltip } from '@material-ui/core';
import {
    CheckCircleOutline as CheckCircleOutlineIcon,
    DeleteForever as DeleteForeverIcon,
    Edit as EditIcon,
    Subject as SubjectIcon,
} from '@material-ui/icons';
import React, { useState } from 'react';

import { BaseMenu, TBaseBlockProps, BaseBlock } from './BaseBlock';
import styles from './BaseBlock.module.scss';


export const TextBlock = (props: TBaseBlockProps) => {
    const [blockValue, setBlockValue] = useState<string | null>(
        props.block?.getData()?.text?.content ?? props.block?.props?.children as string);

    const [isEditing, setIsEditing] = useState<boolean>(false);

    const [isDeleted, setIsDeleted] = useState<boolean>(false);

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

    const handleDelete = () => {
        props.deleteBlock?.();
        setIsDeleted(true);
    }

    if (isDeleted) return <></>;

    return (
        <div>
            <TextMenu saveInst={props.saveInst} block={props.block}
                setIsEditing={handleSetIsEditing} isEditing={isEditing}
                setDeleted={handleDelete}
            />
            {isEditing ? (
                <TextField
                    value={blockValue}
                    onChange={(e) => { setBlockValue(e.target.value) }}
                    multiline
                />
            ) : props?.block?.getDefaultContent()}

        </div>
    );
}

export class TextMenu extends BaseBlock<{
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
    setDeleted: () => void;
}> {

    render() {
        if (this.state.menuVisible) return (
            <div className={styles.actions}>
                <Tooltip title="Text block">
                    <SubjectIcon />
                </Tooltip>
                <Tooltip title="Edit text">
                    <MenuItem onClick={() => {
                        this.props.setIsEditing(!this.props.isEditing);
                    }}>
                        {!this.props.isEditing ? <EditIcon /> : <CheckCircleOutlineIcon />}
                    </MenuItem>
                </Tooltip>
                <Tooltip title="Delete block">
                    <MenuItem onClick={this.props.setDeleted}>
                        <DeleteForeverIcon />
                    </MenuItem>
                </Tooltip>
            </div>
        );
        return <></>
    }
}
