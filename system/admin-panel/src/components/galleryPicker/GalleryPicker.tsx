import { TImageSettings } from '@cromwell/core';
import { IconButton, Tooltip } from '@material-ui/core';
import { Add as AddIcon, Delete as DeleteIcon } from '@material-ui/icons';
import React, { Component } from 'react';

import DraggableList from '../draggableList/DraggableList';
import ImagePicker, { ImagePickerProps } from '../imagePicker/ImagePicker';
import styles from './GalleryPicker.module.scss';

class GalleryPicker extends Component<{
    images?: TImageSettings[];
    onChange?: (images: TImageSettings[]) => void;
    classes?: {
        imagePicker?: ImagePickerProps['classes'];
    }
}> {
    private uncontrolledInput: TImageSettings[] = [];

    private onImageChange = (index: number, value: TImageSettings | null) => {
        let images = [...(this.props.images ?? this.uncontrolledInput)];
        if (value) images = images.map((image, i) => i === index ? value : image);
        else images = images.filter((image, i) => i !== index);
        this.uncontrolledInput = images;
        this.props.onChange?.(images);
    }

    private handleAddImage = () => {
        const images = [...(this.props.images ?? this.uncontrolledInput)];
        images.push({ src: '' });
        this.uncontrolledInput = images;
        this.props.onChange?.(images);
    }

    private handleDeleteAllImages = () => {
        this.uncontrolledInput = [];
        this.props.onChange?.([]);
    }

    render() {
        const images = this.props.images ?? this.uncontrolledInput;

        return (
            <div className={styles.GalleryPicker}>
                <DraggableList<TImageSettings>
                    component={ImageItem}
                    componentProps={{
                        onImageChange: this.onImageChange,
                        classes: this.props.classes?.imagePicker,
                        allImages: images,
                    }}
                    data={images}
                    onChange={(items) => {
                        this.uncontrolledInput = items;
                        this.props.onChange?.(items);
                    }}
                />
                <div className={styles.actions}>
                    <Tooltip title="Add image">
                        <IconButton
                            className={styles.galleryAddImageBtn}
                            aria-label="add image"
                            onClick={this.handleAddImage}
                        >
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Clear all images">
                        <IconButton
                            className={styles.galleryAddImageBtn}
                            aria-label="clear image"
                            onClick={this.handleDeleteAllImages}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
        );
    }
}

const ImageItem = (props: {
    itemProps: {
        onImageChange: (index: number, value: TImageSettings | null) => void;
        classes: ImagePickerProps['classes'];
        allImages: TImageSettings[];
    };
    data: TImageSettings;
}) => {
    const onSrcChange = (src: string | undefined) => {
        props.itemProps.onImageChange(props.itemProps.allImages.indexOf(props.data),
            src ? Object.assign({}, props.data, { src }) : undefined);
    }
    return <ImagePicker
        classes={props.itemProps.classes}
        showRemove
        value={props.data.src}
        placeholder="Pick an image"
        onChange={onSrcChange}
    />
}

export default GalleryPicker;
