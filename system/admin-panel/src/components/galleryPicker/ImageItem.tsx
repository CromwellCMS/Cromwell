import { TImageSettings } from '@cromwell/core';
import React from 'react';

import ImagePicker, { ImagePickerProps } from '../imagePicker/ImagePicker';

export const ImageItem = (props: {
    itemProps: {
        onImageChange: (index: number, value: TImageSettings | null) => void;
        classes: ImagePickerProps['classes'];
        allImages: TImageSettings[];
    };
    data: TImageSettings;
    draggableHandleClass: string;
}) => {
    const onSrcChange = (src: string | undefined) => {
        props.itemProps.onImageChange(props.itemProps.allImages.indexOf(props.data),
            src ? Object.assign({}, props.data, { src }) : undefined);
    }
    return (<ImagePicker
        classes={props.itemProps.classes}
        value={props.data.src}
        placeholder="Pick an image"
        onChange={onSrcChange}
    />)
}