import { TGallerySettings } from '@cromwell/core';
import clsx from 'clsx';
import { CarouselProvider, Image, Slide, Slider } from 'pure-react-carousel';
import React from 'react';

import { getThumbnailSrc } from '../../helpers/thumbs';
import { TImageComponent } from './CGallery';
import styles from './CGallery.module.scss';

const CarouselImage = Image as TImageComponent;

/** @internal */
export default class Thumbs extends React.Component<{
  thumbsId?: string;
  gallerySettings?: TGallerySettings;
  width?: number;
  activeSlide: number;
  totalSlides: number;
  setActiveSlide: (index: number) => void;
  getUpdate: (forceUpdate: () => void) => void;
}> {
  render() {
    const { thumbsId, gallerySettings, width, activeSlide, totalSlides, setActiveSlide, getUpdate } = this.props;

    getUpdate(this.forceUpdate);

    if (!gallerySettings) return <></>;
    const thumbOpts = typeof gallerySettings?.thumbs === 'object' ? gallerySettings.thumbs : undefined;

    const thumbDesiredWidth = (thumbOpts?.width ?? 120) + 16;
    const thumbvisibleSlides = (width && Math.floor(width / thumbDesiredWidth)) || 1;
    const thumbActualWidth = width ? width / thumbvisibleSlides : thumbDesiredWidth;

    let activeThumb = activeSlide - Math.floor(thumbvisibleSlides / 2);
    if (activeThumb < 0) activeThumb = 0;

    let thumbHeight = thumbOpts?.height ?? 80;
    if (thumbHeight > 200) thumbHeight = 200;
    thumbHeight += 16; // for margin

    return (
      <div className={clsx(styles.container, styles.thumbs)} id={thumbsId}>
        <CarouselProvider
          visibleSlides={thumbvisibleSlides}
          naturalSlideWidth={thumbOpts?.width ?? 120}
          naturalSlideHeight={thumbOpts?.height ?? 80}
          totalSlides={totalSlides}
          currentSlide={activeThumb}
        >
          <Slider style={{ width: gallerySettings.width && gallerySettings.width + 'px' }}>
            {gallerySettings.images &&
              gallerySettings.images.map((img, index) => {
                const imgSrc = img.thumb ?? img.src;
                const iActive = activeSlide === index;
                return (
                  <Slide
                    index={index}
                    key={imgSrc + index}
                    tabIndex={index}
                    innerClassName={styles.thumbInner}
                    style={{
                      height: thumbHeight + 'px',
                      width: thumbActualWidth + 'px',
                    }}
                    onClick={() => setActiveSlide(index)}
                    className={clsx(styles.thumbnail, iActive && styles.activeThumb)}
                  >
                    <CarouselImage
                      className={clsx(
                        styles.thumbnailImg,
                        thumbOpts?.backgroundSize === 'contain' ? styles.slideContain : styles.slideCover,
                      )}
                      src={getThumbnailSrc({ src: imgSrc, width: 100, height: 100 })}
                    />
                  </Slide>
                );
              })}
          </Slider>
        </CarouselProvider>
      </div>
    );
  }
}
