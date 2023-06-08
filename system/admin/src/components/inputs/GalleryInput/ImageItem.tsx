import { TImageSettings } from '@cromwell/core';
import React from 'react';

import { ImageInput, ImageInputProps } from '../Image/ImageInput';

export const ImageItem = (props: {
  itemProps: {
    onImageChange: (index: number, value: TImageSettings | null) => void;
    classes: ImageInputProps['classes'];
    allImages: TImageSettings[];
  };
  data: TImageSettings;
  draggableHandleClass: string;
  hideSrc?: boolean;
  onMaximizeImage?: (src: string) => void;
}) => {
  const onSrcChange = (src: string | undefined) => {
    props.itemProps.onImageChange(
      props.itemProps.allImages.indexOf(props.data),
      src ? Object.assign({}, props.data, { src }) : undefined,
    );
  };
  return (
    <ImageInput
      className={'w-[calc(100%-42px)] !h-36'}
      classes={props.itemProps.classes}
      value={props.data.src}
      placeholder="Pick an image"
      onChange={onSrcChange}
      hideSrc={props.hideSrc}
      onMaximizeImage={() => props.onMaximizeImage?.(props.data.src)}
    />
  );
};
