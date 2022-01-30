import { TCromwellBlockProps, TGallerySettings, TImageSettings, TProduct } from '@cromwell/core';
import { CGallery } from '@cromwell/core-frontend';
import clsx from 'clsx';
import React from 'react';

import styles from './ProductGallery.module.scss';

export type ProductGalleryProps = {
  classes?: Partial<Record<'root', string>>;

  /** Product data. Required */
  product?: TProduct | null;

  /**
   * URL to a placeholder image to use if a product has no primary image set.
   */
  noImagePlaceholder?: string;

  /**
   * Gallery settings to pass to underlying CGallery block
   */
  gallerySettings?: TGallerySettings;

  /**
   * Settings to pass to underlying CGallery block
   */
  blockProps?: TCromwellBlockProps;
}

/**
 * Displays a gallery of product images. 
 */
export function ProductGallery(props: ProductGalleryProps) {
  const { product, noImagePlaceholder, gallerySettings, blockProps, classes } = props;
  const hasImages = !!product?.images?.length;

  const images: TImageSettings[] = (hasImages && product?.images?.map(i => {
    return {
      src: i
    }
  })) || (noImagePlaceholder ? [{ src: '/themes/@cromwell/theme-store/no-photos.png' }] : []);

  return (
    <div className={clsx(styles.ProductGallery, classes?.root)}>
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
    </div>
  )
}
