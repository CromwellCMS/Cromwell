import { getRandStr, TImageSettings } from '@cromwell/core';
import { IconButton, Tooltip } from '@material-ui/core';
import { Add as AddIcon, Delete as DeleteIcon } from '@material-ui/icons';
import React, { Component } from 'react';

import { Draggable } from '../../helpers/Draggable/Draggable';
import ImagePicker, { ImagePickerProps } from '../imagePicker/ImagePicker';
import styles from './GalleryPicker.module.scss';

class GalleryPicker extends Component<{
    images?: TImageSettings[];
    onChange?: (images: TImageSettings[]) => void;
    classes?: {
        imagePicker?: ImagePickerProps['classes'];
    }
}> {
    private draggable: Draggable;
    private uncontrolledInput: TImageSettings[] = [];

    private randId = getRandStr(6);
    private galleryItemClass = 'galleryItem_' + this.randId;
    private galleryContainerClass = 'galleryContainer_' + this.randId;
    private getImgHtmlId = (index: number) => `img_${this.randId}_${index}`;
    private getIndexFromElem = (elem?: HTMLElement) => {
        const idx = parseInt(elem?.id?.replace(`img_${this.randId}_`, ''));
        if (!isNaN(idx)) return idx;
    };

    componentDidMount() {
        this.draggable = new Draggable({
            draggableSelector: '.' + this.galleryItemClass,
            containerSelector: '.' + this.galleryContainerClass,
            rootElementSelector: '.' + styles.GalleryPicker,
            onBlockInserted: this.onBlockInserted,
            dragPlacement: 'element',
            createFrame: true,
            disableInsert: true,
            primaryColor: 'transparent',
        });
    }

    componentDidUpdate() {
        this.draggable?.updateBlocks();
    }

    private onBlockInserted = (container: HTMLElement, draggedBlock: HTMLElement, nextElement?: HTMLElement) => {
        let images = [...this.props.images ?? this.uncontrolledInput];
        const index = this.getIndexFromElem(draggedBlock);
        const nextIndex = this.getIndexFromElem(nextElement) ?? -1;

        if (index !== undefined) {
            const img = images[index];

            delete images[index];

            if (nextIndex === -1) {
                images.push(img);
            } else {
                const filtered: TImageSettings[] = []
                images.forEach((image, i) => {
                    if (i === nextIndex) {
                        filtered.push(img)
                    }
                    filtered.push(image)
                });
                images = filtered;
                if (!images.includes(img)) images.push(img);
            }
            images = images.filter(Boolean);

            this.uncontrolledInput = images;
            this.props.onChange?.(images);
        }
    }

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
                <div className={`${this.galleryContainerClass} ${this.galleryItemClass} ${styles.container}`}>
                    {images.map((image, index) => {
                        const onSrcChange = (src: string | undefined) => {
                            this.onImageChange(index, src ? Object.assign({}, image, { src }) : undefined)
                        }
                        return (
                            <div className={this.galleryItemClass} key={image.src + index} id={this.getImgHtmlId(index)}>
                                <ImagePicker
                                    classes={this.props.classes?.imagePicker}
                                    showRemove
                                    value={image.src}
                                    placeholder="Pick an image"
                                    onChange={onSrcChange}
                                />
                            </div>
                        )
                    })}
                </div>
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

export default GalleryPicker;
