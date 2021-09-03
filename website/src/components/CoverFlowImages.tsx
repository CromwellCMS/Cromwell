import 'swiper/css/bundle';

import clsx from 'clsx';
import { useEffect } from 'react';
import { useRef } from 'react';
import React from 'react';
import Swiper, { EffectCoverflow, Lazy } from 'swiper';

Swiper.use([Lazy, EffectCoverflow]);

export const CoverFlowImages = (props: {
    images: string[]
}) => {
    const containerRef = useRef<HTMLDivElement>();

    useEffect(() => {
        const swiper = new Swiper(containerRef.current, {
            effect: "coverflow",
            grabCursor: true,
            slidesPerView: 1.3,
            lazy: true,
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
        <div className={clsx("swiper mySwaper")} ref={containerRef}>
            <div className="swiper-wrapper">
                {props.images.map(image => (
                    <div key={image}
                        className={clsx("swiper-slide")}>
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