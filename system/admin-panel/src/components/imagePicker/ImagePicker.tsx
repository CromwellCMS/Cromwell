import { Tooltip } from '@material-ui/core';
import { AddPhotoAlternateOutlined as AddPhotoAlternateOutlinedIcon } from '@material-ui/icons';
import React, { useRef } from 'react';

import { getFileManager } from '../../components/fileManager/helpers';
import styles from './ImagePicker.module.scss';


const ImagePicker = (props: {
    toolTip?: string;
    label?: string;
    width?: string;
    height?: string;
    onChange?: (value: string) => void;
    value?: string;
    className?: string;
    backgroundSize?: 'contain' | 'cover';
}) => {
    const valueRef = useRef<string | undefined>();
    const onContainerClick = async () => {
        const photoPath = await getFileManager()?.getPhoto();
        if (photoPath) {
            valueRef.current = photoPath;
            props.onChange?.(photoPath);
        }
    }

    const value = props.value ?? valueRef.current;

    let element = (
        <div className={`${styles.wrapper} ${props.className}`}>
            {props.label && (
                <p className={styles.label}>{props.label}</p>
            )}
            <div className={styles.image}
                onClick={onContainerClick}
                style={{
                    backgroundImage: `url(${value})`,
                    backgroundSize: props.backgroundSize ?? 'cover',
                    width: props.width,
                    height: props.height,
                }}>
                {!value && <AddPhotoAlternateOutlinedIcon />}
            </div>
        </div>
    );
    if (props.toolTip) {
        element = (
            <Tooltip title={props.toolTip}>
                {element}
            </Tooltip>
        )
    }
    return element;
}

export default ImagePicker;
