import { Tooltip, IconButton } from '@material-ui/core';
import { AddPhotoAlternateOutlined as AddPhotoAlternateOutlinedIcon, HighlightOffOutlined } from '@material-ui/icons';
import React, { useRef, useState } from 'react';

import { getFileManager } from '../../components/fileManager/helpers';
import styles from './ImagePicker.module.scss';


const ImagePicker = (props: {
    toolTip?: string;
    placeholder?: string;
    label?: string;
    width?: string;
    height?: string;
    onChange?: (value: string | undefined) => void;
    value?: string | null;
    className?: string;
    backgroundSize?: 'contain' | 'cover';
    showRemove?: boolean;
    hideSrc?: boolean;
    classes?: {
        image?: string;
    };
}) => {
    const [internalValue, setInternalValue] = useState<string | undefined>();
    const pickImage = async () => {
        const photoPath = await getFileManager()?.getPhoto();
        if (photoPath) {
            setImage(photoPath);
        }
    }

    const setImage = (val: string | undefined) => {
        props.onChange?.(val);

        if (props.value === undefined)
            setInternalValue(val);
    }

    const value = (props.value !== undefined && props.value !== '') ? props.value : internalValue;

    let element = (
        <div className={`${styles.wrapper} ${props.className}`} style={{ paddingTop: props.label ? '12px' : '' }}>
            <Tooltip title={props.toolTip ?? ''}>
                <div className={`${styles.image} ${props.classes?.image}`}
                    onClick={pickImage}
                    style={{
                        backgroundImage: `url(${value})`,
                        backgroundSize: props.backgroundSize ?? 'cover',
                        width: value && props.width,
                        height: value && props.height,
                    }}>
                    {!value && <AddPhotoAlternateOutlinedIcon />}
                </div>
            </Tooltip>
            {props.label && value && (
                <p className={styles.floatingLabel}>{props.label}</p>
            )}
            {!props.hideSrc && (
                <Tooltip title={props.toolTip ?? ''}>
                    <p
                        onClick={pickImage}
                        className={styles.placeholder}
                        style={{ color: !value ? 'rgba(0, 0, 0, 0.54)' : '#000', marginLeft: '10px' }}
                    >{value ?? props.placeholder ?? props.label ?? ''}</p>
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
    // if (props.toolTip) {
    //     element = (
    //         <Tooltip title={props.toolTip}>
    //             {element}
    //         </Tooltip>
    //     )
    // }
    return element;
}

export default ImagePicker;
