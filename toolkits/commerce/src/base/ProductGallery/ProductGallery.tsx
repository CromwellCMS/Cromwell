import { TCromwellBlockProps, TGallerySettings, TImageSettings, TProduct } from '@cromwell/core';
import { CContainer, CGallery } from '@cromwell/core-frontend';
import clsx from 'clsx';
import React from 'react';

import styles from './ProductGallery.module.scss';

export type ProductGalleryProps = {
  product?: TProduct | null;
  className?: string;
  style?: React.CSSProperties;
  noImagePlaceholder?: string;
  gallerySettings?: TGallerySettings;
  blockProps?: TCromwellBlockProps;
}

export function ProductGallery(props: ProductGalleryProps) {
  const { product, noImagePlaceholder, gallerySettings, blockProps } = props;
  const hasImages = !!product?.images?.length;

  const images: TImageSettings[] = (hasImages && product?.images?.map(i => {
    return {
      src: i
    }
  })) || (noImagePlaceholder ? [{ src: '/themes/@cromwell/theme-store/no-photos.png' }] : []);

  return (
    <CContainer className={clsx(styles.ProductImages, props.className)}
      id="ccom_product_images"
      style={props.style}
    >
      <CGallery id="ccom_product_images_gallery"
        isConstant
        editorHidden
        gallery={{
          images: images,
          loop: false,
          navigation: hasImages && images.length > 1,
          zoom: hasImages,
          thumbs: (hasImages && images.length > 1) ? {
            width: 80,
            height: 80,
          } : false,
          fullscreen: hasImages,
          backgroundSize: 'contain',
          responsive: {
            0: {
              ratio: 1,
              visibleSlides: 1,
            },
            700: {
              ratio: 1,
              visibleSlides: 1,
              height: 600
            }
          },
          ...(gallerySettings ?? {})
        }}
        {...(blockProps ?? {})}
      />
    </CContainer>
  )
}
