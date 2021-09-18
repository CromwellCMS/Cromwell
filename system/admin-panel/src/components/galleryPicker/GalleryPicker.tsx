import { TImageSettings } from '@cromwell/core';
import { IconButton, Tooltip, Popover, TextField } from '@material-ui/core';
import {
    Add as AddIcon,
    DeleteForever as DeleteForeverIcon,
    DeleteOutline as DeleteOutlineIcon,
    DragIndicator as DragIndicatorIcon,
    Link as LinkIcon,
} from '@material-ui/icons';
import clsx from 'clsx';
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
    className?: string;
    hideSrc?: boolean;
    editLink?: boolean;
}, {
    editableLink?: number;
    editableLinkText: string | undefined;
}> {
    private uncontrolledInput: TImageSettings[] = [];
    private editableLinkRef: HTMLButtonElement;

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

    private handleRemoveImage = (index: number) => {
        const images = [...(this.props.images ?? this.uncontrolledInput)]
            .filter((it, idx) => idx !== index);
        this.uncontrolledInput = images;
        this.props.onChange?.(images);
    }

    private handleDeleteAllImages = () => {
        this.uncontrolledInput = [];
        this.props.onChange?.([]);
    }

    private handleShowLink = (index: number, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const images = [...(this.props.images ?? this.uncontrolledInput)];
        this.setState({
            editableLink: index,
            editableLinkText: images[index]?.href,
        });
        this.editableLinkRef = event.target as HTMLButtonElement;
    }

    private handleChangeImageLink = (value: string) => {
        this.setState({
            editableLinkText: value,
        });
    }

    private handleCloseLinkEdit = () => {
        let val = this.state?.editableLinkText;
        if (val === '') val = undefined;
        const images = [...(this.props.images ?? this.uncontrolledInput)];
        if (images[this.state.editableLink]) images[this.state.editableLink].href = val;

        this.uncontrolledInput = images;
        this.props.onChange?.(images);

        this.setState({
            editableLink: undefined,
            editableLinkText: undefined,
        });
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
            <div className={clsx(styles.GalleryPicker, this.props.className)}>
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
                            className={styles.imageItem}
                        >
                            <IconButton style={{ cursor: 'move', marginRight: '10px' }}
                                className="draggableHandle">
                                <DragIndicatorIcon />
                            </IconButton>
                            <ImageItem
                                draggableHandleClass="draggableHandle"
                                key={(image?.id ?? index) + ''}
                                data={image}
                                hideSrc={this.props.hideSrc}
                                itemProps={{
                                    onImageChange: this.onImageChange,
                                    classes: this.props.classes?.imagePicker,
                                    allImages: images,
                                }}
                            />
                            {this.props.editLink && (
                                <IconButton style={{ cursor: 'pointer', marginLeft: '10px' }}
                                    onClick={(event) => this.handleShowLink(index, event)}
                                >
                                    <LinkIcon />
                                </IconButton>
                            )}
                            <IconButton style={{ cursor: 'pointer', marginLeft: '10px' }}
                                onClick={() => this.handleRemoveImage(index)}
                            >
                                <DeleteOutlineIcon />
                            </IconButton>
                            {this.props.editLink && this.state?.editableLink === index && (
                                <Popover
                                    elevation={0}
                                    classes={{ paper: styles.popover }}
                                    open={this.state?.editableLink === index}
                                    anchorEl={this.editableLinkRef}
                                    onClose={this.handleCloseLinkEdit}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                >
                                    <TextField
                                        fullWidth
                                        onChange={(e) => this.handleChangeImageLink(e.target.value)}
                                        value={this.state?.editableLinkText ?? ''}
                                        label="Link"
                                    />
                                </Popover>
                            )}
                        </div>)
                    })}
                </ResponsiveGridLayout>
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
                            <DeleteForeverIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
        );
    }
}


export default GalleryPicker;
