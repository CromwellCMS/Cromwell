import React, { useEffect } from 'react';
import { CromwellBlock } from '../CromwellBlock/CromwellBlock';
import { TCromwellBlockData, getStoreItem, TGallerySettings } from '@cromwell/core';
import { Link } from '../../index';
import Swiper, { Navigation, Pagination, SwiperOptions } from 'swiper';
import styleInject from 'style-inject';
//@ts-ignore
import swiperCSS from "swiper/swiper-bundle.css";
styleInject(swiperCSS);

//@ts-ignore
import styles from './CGallery.module.scss';
Swiper.use([Navigation, Pagination]);

export const CGallery = (props: { id: string, className?: string, settings?: TGallerySettings }) => {
    const { settings, ...rest } = props;

    return (
        <CromwellBlock {...rest} type='image'
            content={(props) => {
                const gallerySettings = (props.data && props.data.gallerySettings) ? props.data.gallerySettings : settings;
                // console.log('gallerySettings', gallerySettings)
                if (gallerySettings) {
                    useEffect(() => {
                        const options: SwiperOptions = {
                            loop: true,
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
                        }
                        // Navigation arrows
                        if (gallerySettings.showNav) options.navigation = {
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        }

                        const mySwiper = new Swiper('.swiper-container', options);
                    }, [])

                }

                if (gallerySettings && gallerySettings.images) {
                    return (
                        <div className={`swiper-container ${styles.swiperContainer}`}>
                            <div className="swiper-wrapper">
                                {gallerySettings.images.map(i => (
                                    <div key={i.src} className={`swiper-slide ${styles.swiperSlide}`}>
                                        <div
                                            style={{
                                                width: '1200px',
                                                height: '400px',
                                                backgroundImage: `url('${i.src}')`
                                            }}
                                            className={styles.swiperImage}
                                        ></div>
                                    </div>

                                ))}
                            </div>
                            <div className="swiper-pagination"></div>

                            <div className="swiper-button-prev"></div>
                            <div className="swiper-button-next"></div>

                            <div className="swiper-scrollbar"></div>
                        </div>
                    )
                } else return <></>
            }}
        />
    )
}