import { getStoreItem, TCromwellBlockProps, TGallerySettings } from '@cromwell/core';
import React, { useEffect, useState } from 'react';
import Swiper, { Lazy, Navigation, Pagination, SwiperOptions, Thumbs, Zoom } from 'swiper';
import 'swiper/swiper-bundle.min.css';

import { CromwellBlock } from '../CromwellBlock/CromwellBlock';
import { Link } from '../Link/Link';
import styles from './CGallery.module.scss';


Swiper.use([Navigation, Pagination, Lazy, Thumbs, Zoom]);


type TCGalleryProps = {
    className?: string;
    settings?: TGallerySettings;
    shouldComponentUpdate?: boolean;
} & TCromwellBlockProps;

export class CGallery extends React.Component<TCGalleryProps> {

    private gallerySettings?: TGallerySettings;
    private blockRef?: React.RefObject<HTMLDivElement>;
    private swiperId?: string;
    private swiperThumbsId?: string;
    private height?: string;
    private galleryContainer?: HTMLElement | null;
    private swiper?: Swiper;
    private galleryThumbs?: Swiper;
    private primaryColor?: string = getStoreItem('palette')?.primaryColor;

    shouldComponentUpdate(nextProps: TCGalleryProps) {
        if (this.swiperId) {
            const galleryContainer = document.getElementById(this.swiperId);
            if (galleryContainer) {
                if (galleryContainer !== this.galleryContainer) return true;
            }
        }
        if (nextProps) {
            if (nextProps.shouldComponentUpdate === false) return false;
        }

        return true;
    }

    componentDidMount() {
        this.updateGallery();
    }
    componentDidUpdate() {
        this.updateGallery();
    }

    // update or init
    private updateGallery = () => {
        const gallerySettings = this.gallerySettings;
        if (gallerySettings && this.swiperId) {
            const galleryContainer = document.getElementById(this.swiperId);
            if (galleryContainer) {

                if (this.galleryContainer === galleryContainer && this.swiper && this.swiper.update) {
                    // update
                    this.swiper.update();
                    if (this.galleryThumbs) this.galleryThumbs.update();
                    this.swiper.slideTo(0);
                    this.swiper.lazy.load();
                } else {
                    // init
                    const options: SwiperOptions = {
                        loop: gallerySettings.loop === false ? false : true,
                        lazy: {
                            loadPrevNext: true
                        },
                        direction: gallerySettings.direction ? gallerySettings.direction : 'horizontal',
                    }
                    if (gallerySettings.slidesPerView) {
                        options.slidesPerView = gallerySettings.slidesPerView;
                    }
                    if (gallerySettings.showScrollbar) {
                        options.scrollbar = {
                            el: '.swiper-scrollbar',
                        }
                    }
                    // If we need pagination
                    if (gallerySettings.showPagination) options.pagination = {
                        el: '.swiper-pagination',
                        clickable: true
                    }
                    // Navigation arrows
                    if (gallerySettings.navigation) options.navigation = {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    }
                    if (gallerySettings.zoom) {
                        options.zoom = {
                            toggle: gallerySettings.zoom.zoomOnHover ? false : true
                        }
                    }

                    if (gallerySettings.showThumbs) {
                        this.galleryThumbs = new Swiper(`#${this.swiperThumbsId}`, {
                            spaceBetween: 10,
                            slidesPerView: 4,
                            grabCursor: true,
                            loop: gallerySettings.loop === false ? false : true,
                            freeMode: true,
                            loopedSlides: gallerySettings.loop ? 5 : undefined,
                            watchSlidesVisibility: true,
                            watchSlidesProgress: true,
                        });
                        options.thumbs = {
                            swiper: this.galleryThumbs,
                            slideThumbActiveClass: styles.swiperThumbActive
                        }
                        options.loopedSlides = 5;
                    }

                    this.swiper = new Swiper(`#${this.swiperId}`, options);

                    if (this.swiper && gallerySettings.navigation && gallerySettings.navigation.showOnHover) {
                        const nextEl = this.swiper.navigation.nextEl;
                        if (nextEl) nextEl.style.display = 'none';
                        const prevEl = this.swiper.navigation.prevEl;
                        if (prevEl) prevEl.style.display = 'none';
                    }
                }

                this.galleryContainer = galleryContainer;


                // calc height if not set
                if (gallerySettings.ratio && !gallerySettings.height && !this.height) {
                    if (!gallerySettings.width || typeof gallerySettings.width === 'string') {
                        // let width = typeof gallerySettings.width === 'string' ? typeof gallerySettings.width : '100%';
                        if (this.blockRef && this.blockRef.current) {
                            let _height = `${this.blockRef.current.clientWidth / gallerySettings.ratio}px`;
                            this.height = _height;
                            // if (this.contentForceUpdate) this.contentForceUpdate();
                            this.forceUpdate();
                        }
                    }
                }

            }
        }
    }

    render() {
        const { settings, ...rest } = this.props;

        return (
            <CromwellBlock {...rest} type='image'
                content={(data, blockRef) => {
                    this.gallerySettings = (data && data.gallery) ? data.gallery : settings;
                    this.blockRef = blockRef;
                    this.swiperId = `swiper-container_${data?.id}`;
                    this.swiperThumbsId = `${this.swiperId}_thumbs`;
                    let _height = '0px';
                    const gallerySettings = this.gallerySettings;
                    if (gallerySettings) {

                        if (gallerySettings.height) {
                            if (typeof gallerySettings.height === 'string') {
                                _height = gallerySettings.height;
                            }
                        }
                        if (gallerySettings.ratio && gallerySettings.width) {
                            if (typeof gallerySettings.width === 'number') {
                                _height = `${gallerySettings.width * gallerySettings.ratio}px`;
                            }
                            if (typeof gallerySettings.width === 'string') {
                                // will be calculated in useEffect
                            }
                        }
                    }

                    if (gallerySettings) {
                        return (
                            <div className={`swiper-container ${styles.swiperContainer}`}
                                id={this.swiperId}
                                style={{
                                    width: gallerySettings.width ? gallerySettings.width : '100%',
                                }}
                                onMouseEnter={() => {
                                    if (this.swiper && gallerySettings.navigation && gallerySettings.navigation.showOnHover) {
                                        const nextEl = this.swiper.navigation.nextEl;
                                        if (nextEl) nextEl.style.display = '';
                                        const prevEl = this.swiper.navigation.prevEl;
                                        if (prevEl) prevEl.style.display = '';
                                    }
                                }}
                                onMouseLeave={() => {
                                    if (this.swiper && gallerySettings.navigation && gallerySettings.navigation.showOnHover) {
                                        const nextEl = this.swiper.navigation.nextEl;
                                        if (nextEl) nextEl.style.display = 'none';
                                        const prevEl = this.swiper.navigation.prevEl;
                                        if (prevEl) prevEl.style.display = 'none';
                                    }
                                }}
                            >
                                <div className="swiper-wrapper"
                                    style={{
                                        height: this.height ? this.height : _height
                                    }}>
                                    {gallerySettings.images && gallerySettings.images.map((i, index) => {
                                        let el = (
                                            <div
                                                data-background={i.src}
                                                attr-data-background={i.src}
                                                style={{
                                                    width: gallerySettings.width ? gallerySettings.width : '100%',
                                                    height: this.height ? this.height : _height,
                                                    backgroundSize: gallerySettings.backgroundSize
                                                    // backgroundImage: `url('${i.src}')`
                                                }}
                                                className={`${styles.swiperImage} swiper-lazy ${gallerySettings.zoom ? 'swiper-zoom-target' : ''}`}
                                                onMouseEnter={() => {
                                                    if (this.swiper && gallerySettings.zoom && gallerySettings.zoom.zoomOnHover) {
                                                        this.swiper.zoom.enable();
                                                        this.swiper.zoom.in();
                                                        this.swiper.$el.addClass(styles.swiperZommedIn);
                                                    }
                                                }}
                                                onMouseLeave={() => {
                                                    if (this.swiper && gallerySettings.zoom && gallerySettings.zoom.zoomOnHover) {
                                                        this.swiper.zoom.out();
                                                        this.swiper.zoom.disable();
                                                        this.swiper.$el.removeClass(styles.swiperZommedIn);
                                                    }
                                                }}
                                            >
                                                <div className="swiper-lazy-preloader swiper-lazy-preloader-white"
                                                    style={{
                                                        border: `4px solid ${this.primaryColor ? this.primaryColor : '#fff'}`,
                                                        borderTopColor: 'transparent'
                                                    }}></div>
                                            </div>
                                        );
                                        if (gallerySettings.components && gallerySettings.components.imgWrapper) {
                                            const WrapComp = gallerySettings.components.imgWrapper;
                                            el = <WrapComp image={i}>{el}</WrapComp>
                                        }
                                        if (gallerySettings.zoom) {
                                            el = <div className="swiper-zoom-container">{el}</div>
                                        }

                                        if (i.href) {
                                            el = (
                                                <Link href={i.href}>{el}</Link>
                                            );
                                        }
                                        el = (
                                            <div key={`${i.src}_${index}`} className={`swiper-slide ${styles.swiperSlide}`}>
                                                {el}
                                            </div>
                                        );

                                        return el;
                                    })}
                                </div>
                                {gallerySettings.showPagination && (
                                    <div className={`swiper-pagination ${styles.swiperPagination}`}></div>
                                )}
                                {gallerySettings.navigation && (<>
                                    <div className="swiper-button-prev"></div>
                                    <div className="swiper-button-next"></div>
                                </>)}
                                {gallerySettings.showScrollbar && (
                                    <div className="swiper-scrollbar"></div>
                                )}
                                {gallerySettings.showThumbs && (
                                    <div className="swiper-container gallery-thumbs"
                                        id={this.swiperThumbsId}
                                    >
                                        <div className="swiper-wrapper">
                                            {gallerySettings.images && gallerySettings.images.map((i, index) => {
                                                const img = i.thumb ? i.thumb : i.src;
                                                const opt = typeof gallerySettings.showThumbs === 'object' ? gallerySettings.showThumbs : undefined;
                                                return (
                                                    <div className={`swiper-slide ${styles.swiperThumb}`}
                                                        key={`${i.src}_${index}`}
                                                        style={{
                                                            backgroundImage: `url(${img})`,
                                                            width: opt && opt.width ? opt.width : '80px',
                                                            height: opt && opt.height ? opt.height : '80px'
                                                        }}></div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    } else return <></>
                }}
            />
        )
    }
}