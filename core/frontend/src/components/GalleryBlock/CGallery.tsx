import React, { useEffect, useState } from 'react';
import { CromwellBlock } from '../CromwellBlock/CromwellBlock';
import { TCromwellBlockData, getStoreItem, TGallerySettings } from '@cromwell/core';
import { Link } from '../Link/Link';
import Swiper, { Navigation, Pagination, SwiperOptions, Lazy, Thumbs } from 'swiper';
import styleInject from 'style-inject';
//@ts-ignore
import swiperCSS from "swiper/swiper-bundle.css";
styleInject(swiperCSS);

//@ts-ignore
import styles from './CGallery.module.scss';
import { type } from 'os';
Swiper.use([Navigation, Pagination, Lazy, Thumbs]);

export const CGallery = (props: { id: string, className?: string, settings?: TGallerySettings }) => {
    const { settings, ...rest } = props;

    return (
        <CromwellBlock {...rest} type='image'
            content={(props) => {
                const gallerySettings = (props.data && props.data.gallerySettings) ? props.data.gallerySettings : settings;
                const swiperId = `swiper-container_${props.data?.componentId}`;
                const swiperThumbsId = `${swiperId}_thumbs`;
                let _height = '0px';
                // console.log('gallerySettings', gallerySettings)
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

                const [height, setHeigth] = useState(_height);

                if (gallerySettings) {
                    useEffect(() => {
                        if (gallerySettings.ratio && !gallerySettings.height) {
                            // calc height if not set
                            if (!gallerySettings.width || typeof gallerySettings.width === 'string') {
                                // let width = typeof gallerySettings.width === 'string' ? typeof gallerySettings.width : '100%';
                                if (props.blockRef && props.blockRef.current) {
                                    let _height = `${props.blockRef.current.clientWidth / gallerySettings.ratio}px`;
                                    setHeigth(_height);
                                }
                            }
                        }

                        let galleryThumbs;
                        if (gallerySettings.showThumbs) {
                            galleryThumbs = new Swiper(`#${swiperThumbsId}`, {
                                spaceBetween: 10,
                                slidesPerView: 4,
                                loop: gallerySettings.loop === false ? false : true,
                                freeMode: true,
                                loopedSlides: gallerySettings.loop ? 5 : undefined,
                                watchSlidesVisibility: true,
                                watchSlidesProgress: true,
                            });
                        }

                        const options: SwiperOptions = {
                            loop: gallerySettings.loop === false ? false : true,
                            lazy: {
                                loadPrevNext: true
                            },
                            direction: gallerySettings.direction ? gallerySettings.direction : 'horizontal',
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
                        if (gallerySettings.showNav) options.navigation = {
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        }
                        if (gallerySettings.showThumbs) {
                            options.thumbs = {
                                swiper: galleryThumbs,
                                slideThumbActiveClass: styles.swiperThumbActive
                            }
                            options.loopedSlides = 5;
                        }

                        const swiper = new Swiper(`#${swiperId}`, options);
                    }, [])
                }

                if (gallerySettings && gallerySettings.images) {
                    return (
                        <div className={`swiper-container ${styles.swiperContainer}`}
                            id={swiperId}
                            style={{
                                width: gallerySettings.width ? gallerySettings.width : '100%',
                            }}>
                            <div className="swiper-wrapper"
                                style={{
                                    height: height
                                }}>
                                {gallerySettings.images.map(i => {
                                    let el = (
                                        <div
                                            data-background={i.src}
                                            attr-data-background={i.src}
                                            style={{
                                                width: gallerySettings.width ? gallerySettings.width : '100%',
                                                height: height
                                                // backgroundImage: `url('${i.src}')`
                                            }}
                                            className={`${styles.swiperImage} swiper-lazy`}
                                        >
                                            <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
                                        </div>
                                    );
                                    if (i.href) {
                                        el = (
                                            <Link href={i.href}>{el}</Link>
                                        );
                                    }
                                    el = (
                                        <div key={i.src} className={`swiper-slide ${styles.swiperSlide}`}>
                                            {el}
                                        </div>
                                    );

                                    return el;
                                })}
                            </div>
                            {gallerySettings.showPagination && (
                                <div className="swiper-pagination"></div>
                            )}
                            {gallerySettings.showNav && (
                                <>
                                    <div className="swiper-button-prev"></div>
                                    <div className="swiper-button-next"></div>
                                </>
                            )}
                            {gallerySettings.showScrollbar && (
                                <div className="swiper-scrollbar"></div>
                            )}
                            {gallerySettings.showThumbs && (
                                <div className="swiper-container gallery-thumbs"
                                    id={swiperThumbsId}
                                >
                                    <div className="swiper-wrapper">
                                        {gallerySettings.images.map(i => {
                                            const img = i.thumb ? i.thumb : i.src;
                                            const opt = typeof gallerySettings.showThumbs === 'object' ? gallerySettings.showThumbs : undefined;
                                            return (
                                                <div className={`swiper-slide ${styles.swiperThumb}`}
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