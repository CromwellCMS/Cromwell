import 'swiper/css/bundle';

import clsx from 'clsx';
import { useEffect } from 'react';
import { useRef } from 'react';
import React from 'react';
import Swiper, { EffectCoverflow, Lazy } from 'swiper';
import styles from './CoverFlowImages.module.css';

Swiper.use([Lazy, EffectCoverflow]);

export const CoverFlowImages = (props: {
    images: string[]
}) => {
    const containerRef = useRef<HTMLDivElement>();

    useEffect(() => {
        const swiper = new Swiper(containerRef.current, {
            effect: "coverflow",
            grabCursor: true,
            // slidesPerView: 1.3,
            slidesPerView: "auto",
            spaceBetween: 30,
            lazy: true,
            height: 400,
            coverflowEffect: {
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
            },
        });
    }, []);

    return (
        <div className={clsx("swiper", styles.swiper)} ref={containerRef}>
            <div className="swiper-wrapper">
                {props.images.map(image => (
                    <div key={image}
                        className={clsx("swiper-slide", styles.slide)}>
                        <img
                            data-src={image}
                            className="swiper-lazy"
                        />
                        <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
                    </div>
                ))}
            </div>
        </div>
    )
}