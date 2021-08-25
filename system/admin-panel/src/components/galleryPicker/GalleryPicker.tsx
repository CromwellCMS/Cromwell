import { TImageSettings } from '@cromwell/core';
import { IconButton, Tooltip } from '@material-ui/core';
import { Add as AddIcon, Delete as DeleteIcon, DragIndicator as DragIndicatorIcon } from '@material-ui/icons';
import React, { Component } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';

import { ImagePickerProps } from '../imagePicker/ImagePicker';
import styles from './GalleryPicker.module.scss';
import { ImageItem } from './ImageItem';

const ResponsiveGridLayout = WidthProvider(Responsive);

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

    private onLayoutChange = (images: TImageSettings[]) => (layout) => {
        const sortedImages: TImageSettings[] = [];
        const sorted = [...layout].sort((a, b) => (a.x + a.y * 10) - (b.x + b.y * 10));
        sorted.forEach(item => {
            const img = images.find((image, index) => (image.id ?? index) + '' === item.i);
            if (img) sortedImages.push(img);
        });

        this.uncontrolledInput = sortedImages;
        this.props.onChange?.(sortedImages);
    }

    private getGridLayout = (images: TImageSettings[]) => {
        return {
            xxs: images.map((image, index) => {
                return { i: (image.id ?? index) + '', x: 0, y: index, w: 1, h: 1 }
            }),
        }
    }

    render() {
        const images = (this.props.images ?? this.uncontrolledInput ?? []).map((image, index) => {
            if (!image.id) image.id = image.src + index;
            return image;
        });

        return (
            <div className={styles.GalleryPicker}>
                <ResponsiveGridLayout
                    margin={[0, 0]}
                    isResizable={false}
                    breakpoints={{ xs: 480, xxs: 0 }}
                    rowHeight={64}
                    layouts={this.getGridLayout(images)}
                    onLayoutChange={this.onLayoutChange(images)}
                    cols={{ xs: 1, xxs: 1 }}
                    draggableHandle='.draggableHandle'
                >
                    {images.map((image, index) => {
                        return (<div
                            key={(image?.id ?? index) + ''}
                            className={styles.ImageItem}
                        >
                            <IconButton style={{ cursor: 'move', marginRight: '10px' }}
                                className="draggableHandle">
                                <DragIndicatorIcon />
                            </IconButton>
                            <ImageItem
                                draggableHandleClass="draggableHandle"
                                key={(image?.id ?? index) + ''}
                                data={image}
                                itemProps={{
                                    onImageChange: this.onImageChange,
                                    classes: this.props.classes?.imagePicker,
                                    allImages: images,
                                }}
                            />
                        </div>)
                    })}
                </ResponsiveGridLayout>
                {/* <DraggableList<TImageSettings>
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
                /> */}
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
