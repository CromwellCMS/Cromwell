import React, { Component } from 'react';
import { Draggable } from '../../helpers/Draggable/Draggable';
import { getRandStr, TGallerySettings, TImageSettings } from '@cromwell/core';
import { IconButton, TextField, Tooltip } from '@material-ui/core';
import styles from './GalleryPicker.module.scss';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    DeleteForever as DeleteForeverIcon,
    Edit as EditIcon,
    Star as StarIcon,
    StarBorder as StarBorderIcon,
} from '@material-ui/icons';
import ImagePicker from '../imagePicker/ImagePicker';

class GalleryPicker extends Component<{
    images?: TImageSettings[];
    onChange?: (images: TImageSettings[]) => void;
}> {
    private draggable: Draggable;
    private uncontrolledInput: TImageSettings[] = [];

    private randId = getRandStr(6);
    private galleryItemClass = 'galleryItem_' + this.randId;
    private galleryContainerClass = 'galleryContainer_' + this.randId;
    private getImgHtmlId = (src: string) => `img_${this.randId}_${src}`;

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

    private onBlockInserted = (container: HTMLElement, draggedBlock: HTMLElement, nextElement?: Element) => {
        let images = [...this.props.images ?? this.uncontrolledInput];
        let index;
        let nextIndex = -1;
        images.forEach((img, i) => {
            if (draggedBlock.id === this.getImgHtmlId(img.src)) {
                index = i;
            }
            if (nextElement && nextElement.id === this.getImgHtmlId(img.src)) {
                nextIndex = i;
            }
        });
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
                            <div className={this.galleryItemClass} key={image.src} id={this.getImgHtmlId(image.src)}>
                                <ImagePicker
                                    showRemove
                                    value={image.src}
                                    label="Pick an image"
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
