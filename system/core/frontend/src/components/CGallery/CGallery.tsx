import { getRandStr, TCromwellBlockData, TCromwellBlockProps, TGallerySettings } from '@cromwell/core';
import clsx from 'clsx';
import {
    ButtonBack,
    ButtonNext,
    CarouselContext,
    CarouselInjectedProps,
    CarouselProvider,
    CarouselStoreInterface,
    DotGroup,
    Image as CarouselImage,
    ImageWithZoom,
    Slide,
    Slider,
    WithStore,
} from 'pure-react-carousel';
import React, { useContext, useEffect } from 'react';
import ReactResizeDetector from 'react-resize-detector';

import { CromwellBlock } from '../CromwellBlock/CromwellBlock';
import { Link } from '../Link/Link';
import styles from './CGallery.module.scss';
import Lightbox from './Lightbox';
import Thumbs from './Thumbs';

type TCGalleryProps = {
    className?: string;
    shouldComponentUpdate?: boolean;
} & TCromwellBlockProps;

class CarouselStoreSetterRaw extends React.Component<CarouselInjectedProps & {
    setStore: (store: CarouselStoreInterface) => any;
}> {
    constructor(props) {
        super(props);
        this.props.setStore(this.props.carouselStore);
    }
    render() {
        this.props.setStore(this.props.carouselStore);
        return <></>;
    }
}
const CarouselStoreSetter = WithStore(CarouselStoreSetterRaw);

export class CGallery extends React.Component<TCGalleryProps> {

    private gallerySettings?: TGallerySettings;
    private galleryId?: string;
    private thumbsId?: string;
    private randId = getRandStr(5);
    private galleryStore?: CarouselStoreInterface;
    private thumbsStore?: CarouselStoreInterface;
    private activeSlide: number = 0;
    private setLightbox?: (open: boolean, index: number) => void;
    private forceUpdateThumbs?: () => void;

    private onActiveSlideChange = (index: number) => {
        this.activeSlide = index;
        if (this.gallerySettings?.thumbs && this.gallerySettings?.images?.length)
            this.forceUpdateThumbs?.();
    }

    private setActiveSlide = (index: number) => {
        this.galleryStore?.setStoreState({ currentSlide: index })
    }

    private openFullScreen = (index: number) => {
        this.setLightbox?.(true, index);
    }

    private onSlideClick = (index: number) => {
        if (this.gallerySettings?.fullscreen) this.openFullScreen(index)
    }

    private getContent = (data?: TCromwellBlockData, width?: number, height?: number) => {
        const { gallery: propsSettings } = this.props;
        const totalGallerySettings = data?.gallery ?? propsSettings;

        this.gallerySettings = totalGallerySettings;

        if (totalGallerySettings?.responsive && width && Object.keys(totalGallerySettings?.responsive).length) {
            // find closest breakpoint to width but less
            let closest = 0;
            Object.keys(totalGallerySettings.responsive).forEach((b, index) => {
                if (index === 0) {
                    // use first if no appropriate would found
                    this.gallerySettings = totalGallerySettings?.responsive?.[b];
                }
                const breakpoint = parseInt(b);
                if (isNaN(breakpoint)) return;
                if (breakpoint > closest && breakpoint < width) {
                    closest = breakpoint;
                    this.gallerySettings = totalGallerySettings?.responsive?.[b];
                }
            });

            // Make responsive config override higher-level one
            this.gallerySettings = Object.assign({}, totalGallerySettings, this.gallerySettings)
        }

        const gallerySettings = this.gallerySettings;
        this.galleryId = `CGallery_${data?.id}_${this.randId}`;
        this.thumbsId = `${this.galleryId}_thumbs`;

        if (!gallerySettings || !(gallerySettings.images || gallerySettings.slides)) return <></>;
        const Image = gallerySettings.zoom ? ImageWithZoom : CarouselImage;

        const totalSlides = gallerySettings.images?.length ?? gallerySettings.slides?.length ?? 0
        let visibleSlides = gallerySettings.visibleSlides ?? 1;
        if (visibleSlides > totalSlides) visibleSlides = totalSlides;

        const ButtonBackContent = gallerySettings.components?.backButton ?? (() => <div className={clsx(styles.navBtnContent, styles.btnBack)}></div>);
        const ButtonNextContent = gallerySettings.components?.nextButton ?? (() => <div className={clsx(styles.navBtnContent, styles.btnNext)}></div>);

        let slideWidth;
        if (width && gallerySettings.slideMinWidth && !gallerySettings.visibleSlides) {
            const maxSlides = Math.floor(width / gallerySettings.slideMinWidth)
            slideWidth = width / maxSlides;
            if (gallerySettings.slideMaxWidth && slideWidth > gallerySettings.slideMaxWidth) slideWidth = gallerySettings.slideMaxWidth;

            visibleSlides = maxSlides;
        }

        let containerHeight = gallerySettings.height;
        if (gallerySettings.autoHeight) containerHeight = height;

        let interval = gallerySettings.interval;
        if (typeof interval === 'number') {
            if (interval < 400) interval = 400;
        }

        const galleryJsx = (
            <CarouselProvider
                orientation={gallerySettings.orientation}
                visibleSlides={visibleSlides}
                naturalSlideWidth={gallerySettings.ratio ? 100 * gallerySettings.ratio : 125}
                naturalSlideHeight={100}
                totalSlides={totalSlides}
                infinite={gallerySettings.loop}
                interval={interval}
                isPlaying={gallerySettings.autoPlay}
            >
                <CarouselOnChangeWatcher onChange={this.onActiveSlideChange} />
                <CarouselStoreSetter setStore={(store) => { this.galleryStore = store }} />
                <div
                    className={styles.container}
                    style={{
                        height: containerHeight ? containerHeight + 'px' : '100%',
                        width: gallerySettings.width ? gallerySettings.width + 'px' : '100%',
                    }}>
                    <Slider
                        style={containerHeight !== undefined ? {
                            height: containerHeight + 'px',
                        } : undefined}
                    >
                        {gallerySettings.images && gallerySettings.images.map((img, index) => {
                            if (!img.src) return <></>;
                            let imgItem = (
                                <Image src={img.src}
                                    style={containerHeight !== undefined ? {
                                        height: containerHeight + 'px',
                                    } : undefined}
                                    overlayClassName={styles.imageOverlay}
                                    alt={img.alt}
                                    hasMasterSpinner={true}
                                    className={clsx(gallerySettings?.backgroundSize === 'contain' ? styles.slideContain : styles.slideCover)}
                                />
                            );

                            if (gallerySettings.components?.imgWrapper) {
                                const WrapComp = gallerySettings.components.imgWrapper;
                                imgItem = <WrapComp image={img}>{imgItem}</WrapComp>
                            }

                            if (img.href) {
                                imgItem = (
                                    <Link href={img.href}>{imgItem}</Link>
                                );
                            }
                            imgItem = (
                                <Slide onClick={() => this.onSlideClick(index)} index={index} key={img.src + index}
                                    style={{
                                        height: containerHeight && containerHeight + 'px'
                                    }}
                                >
                                    {imgItem}
                                </Slide>
                            );

                            return imgItem;
                        })}
                        {gallerySettings.slides && gallerySettings.slides.map((slideJsx, index) => {
                            let el = slideJsx;
                            if (gallerySettings.components?.imgWrapper) {
                                const WrapComp = gallerySettings.components.imgWrapper;
                                el = <WrapComp>{el}</WrapComp>
                            }
                            return (
                                <Slide
                                    onClick={() => this.onSlideClick(index)}
                                    index={index}
                                    key={`slide_${index}`}
                                    style={{
                                        height: containerHeight && height + 'px',
                                        // width: slideWidth && slideWidth + 'px',
                                    }}
                                >
                                    {el}
                                </Slide>
                            );
                        })}
                    </Slider>
                    {gallerySettings.pagination && (
                        <div className={styles.dotContainer}>
                            <DotGroup className={styles.dotGroup} />
                        </div>
                    )}
                    {gallerySettings.navigation && (<>
                        <ButtonBack className={clsx(styles.navBtn, styles.navBtnBack, gallerySettings.classes?.navBtn)}><ButtonBackContent /></ButtonBack>
                        <ButtonNext className={clsx(styles.navBtn, styles.navBtnNext, gallerySettings.classes?.navBtn)}><ButtonNextContent /></ButtonNext>
                    </>)}
                </div>
            </CarouselProvider>
        );

        return (
            <>
                {galleryJsx}
                {gallerySettings?.thumbs && gallerySettings?.images?.length && (
                    <Thumbs
                        thumbsId={this.thumbsId}
                        gallerySettings={gallerySettings}
                        width={width}
                        activeSlide={this.activeSlide}
                        totalSlides={totalSlides}
                        setActiveSlide={this.setActiveSlide}
                        getUpdate={(forceUpdate) => { this.forceUpdateThumbs = forceUpdate }}
                    />
                )}
                {gallerySettings?.fullscreen && gallerySettings.images && (
                    <Lightbox
                        images={gallerySettings.images?.map(img => img.src) ?? []}
                        getState={(setOpen) => {
                            this.setLightbox = setOpen;
                        }}
                    />
                )}
            </>
        );
    }

    render() {
        return (
            <CromwellBlock {...this.props} type='gallery'
                key={this.props.id + '_crw'}
                content={(data, ref, setContentInstance) => {
                    setContentInstance(this);
                    return (
                        <ReactResizeDetector
                            handleWidth handleHeight
                            refreshMode="throttle"
                            refreshRate={50}
                        >
                            {({ targetRef, width, height }) => {
                                return (
                                    <div id={this.galleryId}
                                        className={styles.max}
                                        ref={targetRef as any}
                                    >
                                        {this.getContent(data, width, height)}
                                    </div>
                                )
                            }}
                        </ReactResizeDetector>
                    )
                }}
            />
        )
    }
}

export function CarouselOnChangeWatcher(props: {
    onChange: (index: number) => void;
}) {
    const carouselContext = useContext(CarouselContext);

    useEffect(() => {
        function onChange() {
            props.onChange(carouselContext.state.currentSlide);
        }
        carouselContext.subscribe(onChange);
        return () => carouselContext.unsubscribe(onChange);
    }, [carouselContext]);
    return <></>;
}