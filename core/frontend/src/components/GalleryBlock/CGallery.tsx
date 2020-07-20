import React, { useEffect } from 'react';
import { CromwellBlock } from '../CromwellBlock/CromwellBlock';
import { TCromwellBlockData, getStoreItem, TGallerySettings } from '@cromwell/core';
import { Link } from '../../index';
import Swiper, { Navigation, Pagination, SwiperOptions, Lazy } from 'swiper';
import styleInject from 'style-inject';
//@ts-ignore
import swiperCSS from "swiper/swiper-bundle.css";
styleInject(swiperCSS);

//@ts-ignore
import styles from './CGallery.module.scss';
Swiper.use([Navigation, Pagination, Lazy]);

export const CGallery = (props: { id: string, className?: string, settings?: TGallerySettings }) => {
    const { settings, ...rest } = props;

    return (
        <CromwellBlock {...rest} type='image'
            content={(props) => {
                const gallerySettings = (props.data && props.data.gallerySettings) ? props.data.gallerySettings : settings;
                const swiperId = `swiper-container_${props.data?.componentId}`;
                // console.log('gallerySettings', gallerySettings)
                if (gallerySettings) {
                    useEffect(() => {
                        const options: SwiperOptions = {
                            loop: true,
                            lazy: {
                                loadPrevNext: true
                            },
                            // Optional parameters
                            direction: 'horizontal',
                            // And if we need scrollbar
                            scrollbar: {
                                el: '.swiper-scrollbar',
                            },
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

                        const mySwiper = new Swiper(`#${swiperId}`, options);
                    }, [])

                }

                if (gallerySettings && gallerySettings.images) {
                    return (
                        <div className={`swiper-container ${styles.swiperContainer}`}
                            id={swiperId}
                            style={{
                                width: gallerySettings.width ? gallerySettings.width : '1200px',
                                height: gallerySettings.height ? gallerySettings.height : '400px',
                            }}>
                            <div className="swiper-wrapper">
                                {gallerySettings.images.map(i => {
                                    let el = (
                                        <div
                                            data-background={i.src}
                                            attr-data-background={i.src}
                                            style={{
                                                width: gallerySettings.width ? gallerySettings.width : '1200px',
                                                height: gallerySettings.height ? gallerySettings.height : '400px',
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
                        </div>
                    )
                } else return <></>
            }}
        />
    )
}