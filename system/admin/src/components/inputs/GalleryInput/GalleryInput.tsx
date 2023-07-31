import { TImageSettings } from '@cromwell/core';
import { Lightbox } from '@cromwell/core-frontend';
import { LinkIcon, TrashIcon, TrashIcon as FillTrashIcon } from '@heroicons/react/24/outline';
import { Add as AddIcon } from '@mui/icons-material';
import { IconButton, Popover, TextField, Tooltip } from '@mui/material';
import clsx from 'clsx';
import React, { Component } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';

import { GrabIcon } from '../../icons/grabIcon';
import { ImageInputProps } from '../Image/ImageInput';
import styles from './GalleryInput.module.scss';
import { ImageItem } from './ImageItem';

const ResponsiveGridLayout = WidthProvider(Responsive);

export type GalleryPickerProps = {
  images?: TImageSettings[];
  onChange?: (images: TImageSettings[]) => void;
  classes?: {
    imageInput?: ImageInputProps['classes'];
  };
  className?: string;
  label?: string;
  hideSrc?: boolean;
  editLink?: boolean;
  style?: React.CSSProperties;
};

export class GalleryPicker extends Component<
  GalleryPickerProps,
  {
    editableLink?: number;
    editableLinkText: string | undefined;
  }
> {
  private uncontrolledInput: TImageSettings[] = [];
  private editableLinkRef: HTMLButtonElement;
  private setLightbox?: (open: boolean, index: number, images: string[]) => void;

  private onImageChange = (index: number, value: TImageSettings | null) => {
    let images = [...(this.props.images ?? this.uncontrolledInput)];
    if (value) images = images.map((image, i) => (i === index ? value : image));
    else images = images.filter((image, i) => i !== index);
    this.uncontrolledInput = images;
    this.props.onChange?.(images);
  };

  private handleAddImage = () => {
    const images = [...(this.props.images ?? this.uncontrolledInput)];
    images.push({ src: '' });
    this.uncontrolledInput = images;
    this.props.onChange?.(images);
  };

  private handleRemoveImage = (index: number) => {
    const images = [...(this.props.images ?? this.uncontrolledInput)].filter((it, idx) => idx !== index);
    this.uncontrolledInput = images;
    this.props.onChange?.(images);
  };

  private handleDeleteAllImages = () => {
    this.uncontrolledInput = [];
    this.props.onChange?.([]);
  };

  private handleShowLink = (index: number, event: React.MouseEvent<Element, MouseEvent>) => {
    const images = [...(this.props.images ?? this.uncontrolledInput)];
    this.setState({
      editableLink: index,
      editableLinkText: images[index]?.href,
    });
    this.editableLinkRef = event.target as HTMLButtonElement;
  };

  private handleChangeImageLink = (value: string) => {
    this.setState({
      editableLinkText: value,
    });
  };

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
  };

  private onLayoutChange = (images: TImageSettings[]) => (layout) => {
    const sortedImages: TImageSettings[] = [];
    const sorted = [...layout].sort((a, b) => a.x + a.y * 10 - (b.x + b.y * 10));
    sorted.forEach((item) => {
      const img = images.find((image, index) => (image.id ?? index) + '' === item.i);
      if (img) sortedImages.push(img);
    });

    if ([...(this.props.images ?? this.uncontrolledInput)].every((img, index) => img === sortedImages[index])) return;

    this.uncontrolledInput = sortedImages;
    this.props.onChange?.(sortedImages);
  };

  private getGridLayout = (images: TImageSettings[]) => {
    return {
      xxs: images.map((image, index) => {
        return { i: (image.id ?? index) + '', x: 0, y: index, w: 1, h: 1 };
      }),
    };
  };

  private onMaximizeImage = (src: string) => {
    const images = (this.props.images ?? this.uncontrolledInput ?? []).map((image) => image.src);
    const index = images.indexOf(src);
    if (index > -1) {
      this.setLightbox?.(true, index, images);
    }
  };

  render() {
    const images = (this.props.images ?? this.uncontrolledInput ?? []).map((image, index) => {
      if (!image.id) image.id = image.src + index;
      return image;
    });

    return (
      <div className={clsx('w-full relative', this.props.className)} style={this.props.style}>
        {this.props.label && <p className="font-bold pb-1 pl-[2px] text-gray-700">{this.props.label}</p>}
        <div className="rounded-lg bg-gray-100 ">
          {images?.length === 0 && (
            <div className="flex w-full top-[45%] left-0 z-10 absolute">
              <span className="font-bold mx-auto text-base p-1 text-gray-700 self-center">
                No Images. Tap on + to add an image
              </span>
            </div>
          )}
          <ResponsiveGridLayout
            margin={[5, 15]}
            isResizable={false}
            breakpoints={{ xs: 480, xxs: 0 }}
            rowHeight={144}
            layouts={this.getGridLayout(images)}
            onLayoutChange={this.onLayoutChange(images)}
            cols={{ xs: 1, xxs: 1 }}
            draggableHandle=".draggableHandle"
            className="min-h-[150px] py-2 px-1"
          >
            {images.map((image, index) => {
              return (
                <div key={(image?.id ?? index) + ''} className={'!h-36 w-full flex flex-row gap-1'}>
                  <GrabIcon className="rounded-md cursor-grab h-7 mr-2 p-1 w-7 self-center draggableHandle hover:bg-indigo-100" />
                  <ImageItem
                    draggableHandleClass="draggableHandle"
                    key={(image?.id ?? index) + ''}
                    data={image}
                    hideSrc={this.props.hideSrc}
                    itemProps={{
                      onImageChange: this.onImageChange,
                      classes: this.props.classes?.imageInput,
                      allImages: images,
                    }}
                    onMaximizeImage={this.onMaximizeImage}
                  />
                  {this.props.editLink && (
                    <LinkIcon
                      onClick={(event) => this.handleShowLink(index, event)}
                      className="rounded-md cursor-pointer h-7 mr-2 p-1 w-7 self-center hover:bg-indigo-100"
                    />
                  )}
                  <TrashIcon
                    onClick={() => this.handleRemoveImage(index)}
                    className="rounded-md cursor-pointer h-7 mr-2 p-1 text-gray-600 w-7 self-center hover:bg-indigo-100 hover:text-red-600"
                  />
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
                        variant="standard"
                      />
                    </Popover>
                  )}
                </div>
              );
            })}
          </ResponsiveGridLayout>
          <div className="flex flex-row w-full gap-2 justify-between">
            <Tooltip title="Add image">
              <IconButton className={styles.galleryAddImageBtn} aria-label="add image" onClick={this.handleAddImage}>
                <AddIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Clear all images">
              <IconButton
                className={styles.galleryAddImageBtn}
                aria-label="clear image"
                onClick={this.handleDeleteAllImages}
              >
                <FillTrashIcon className="h-6 text-gray-500 w-6 hover:text-red-500" />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <Lightbox
          getState={(setOpen) => {
            this.setLightbox = setOpen;
          }}
        />
      </div>
    );
  }
}
