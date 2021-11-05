import { IconButton, MenuItem, Tooltip } from '@mui/material';
import { AddPhotoAlternateOutlined as AddPhotoAlternateOutlinedIcon, HighlightOffOutlined } from '@mui/icons-material';
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
        props.onChange?.(val);

        if (props.value === undefined)
            setInternalValue(val);
    }

    const getDimension = (dimension: string | number) => dimension && (typeof dimension === 'number' ? dimension + 'px' : dimension);

    const element = (
        <div className={`${styles.wrapper} ${props.className ?? ''} ${props.classes?.root ?? ''} ${props.variant ?? ''}`}
            style={{ paddingTop: props.label ? '18px' : '', ...(props.style ?? {}) }}>
            <Tooltip title={props.toolTip ?? ''}>
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
            {props.label && value && (
                <p className={styles.floatingLabel}>{props.label}</p>
            )}
            {!props.hideSrc && (
                <Tooltip title={props.toolTip ?? ''}>
                    <div className={styles.valueWrapper}>
                        <p
                            onClick={pickImage}
                            className={styles.placeholder}
                            style={{ color: !value ? 'rgba(0, 0, 0, 0.54)' : '#000', marginLeft: '10px' }}
                        >{value ?? props.placeholder ?? props.label ?? ''}</p>
                    </div>
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
