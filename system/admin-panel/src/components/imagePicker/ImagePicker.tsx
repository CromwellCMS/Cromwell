import { AddPhotoAlternateOutlined as AddPhotoAlternateOutlinedIcon, HighlightOffOutlined } from '@mui/icons-material';
import { IconButton, MenuItem, TextField, Tooltip } from '@mui/material';
import React, { useState } from 'react';

import { getFileManager } from '../../components/fileManager/helpers';
import styles from './ImagePicker.module.scss';

export type ImagePickerProps = {
    toolTip?: string;
    placeholder?: string;
    label?: string;
    width?: string | number;
    height?: string | number;
    onChange?: (value: string | undefined) => void;
    value?: string | null;
    className?: string;
    backgroundSize?: 'contain' | 'cover' | string;
    showRemove?: boolean;
    hideSrc?: boolean;
    classes?: {
        image?: string;
        root?: string;
    };
    style?: React.CSSProperties;
    variant?: 'standard'
}

export const ImagePicker = (props: ImagePickerProps) => {
    const [internalValue, setInternalValue] = useState<string | undefined>();
    const value = (props.value !== undefined && props.value !== '') ? props.value : internalValue;

    const pickImage = async () => {
        const photoPath = await getFileManager()?.getPhoto({ initialFileLocation: value });
        if (photoPath) {
            setImage(photoPath);
        }
    }

    const setImage = (val: string | undefined) => {
        if (val === '') val = null;
        props.onChange?.(val);

        if (props.value === undefined)
            setInternalValue(val);
    }

    const getDimension = (dimension: string | number) => dimension && (typeof dimension === 'number' ? dimension + 'px' : dimension);

    const element = (
        <div className={`${styles.wrapper} ${props.className ?? ''} ${props.classes?.root ?? ''} ${props.variant ?? ''}`}
            style={{ ...(props.style ?? {}) }}>
            <Tooltip title={props.toolTip ?? 'Pick an image'}>
                <MenuItem
                    style={{
                        padding: '0',
                        width: getDimension(props.width),
                        minWidth: getDimension(props.width),
                        height: getDimension(props.height),
                    }}
                    className={styles.imageWrapper}>
                    <div className={`${styles.image} ${props.classes?.image}`}
                        onClick={pickImage}
                        style={{
                            backgroundImage: `url(${value})`,
                            backgroundSize: props.backgroundSize ?? 'cover',
                            width: getDimension(props.width),
                            minWidth: getDimension(props.width),
                            height: getDimension(props.height),
                        }}>
                        {!value && <AddPhotoAlternateOutlinedIcon
                            style={{
                                width: '65%',
                                height: '65%',
                                maxWidth: '30px',
                                maxHeight: '30px',
                            }}
                        />}
                    </div>
                </MenuItem>
            </Tooltip>
            {!props.hideSrc && (
                <Tooltip title={props.toolTip ?? ''}>
                    <TextField
                        value={value ?? ''}
                        onChange={e => {
                            setImage(e.target.value);
                        }}
                        label={props.label}
                        fullWidth
                        variant={props.variant ?? "standard"}
                    />
                </Tooltip>
            )}
            {value && props.showRemove && (
                <IconButton
                    className={styles.removeBtn}
                    onClick={(e) => { e.stopPropagation(); setImage(undefined); }}>
                    <HighlightOffOutlined />
                </IconButton>
            )}
        </div>
    );
    return element;
}
