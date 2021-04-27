import { getStoreItem, TCromwellBlockProps, TGallerySettings } from '@cromwell/core';
import React from 'react';
import Swiper, { Lazy, Navigation, Pagination, SwiperOptions, Thumbs, Zoom } from 'swiper';
import 'swiper/swiper-bundle.min.css';

import { CromwellBlock } from '../CromwellBlock/CromwellBlock';
import { Link } from '../Link/Link';
import styles from './CGallery.module.scss';


Swiper.use([Navigation, Pagination, Lazy, Thumbs, Zoom]);


type TCGalleryProps = {
    className?: string;
    shouldComponentUpdate?: boolean;
} & TCromwellBlockProps;

export class CGallery extends React.Component<TCGalleryProps> {

    private gallerySettings?: TGallerySettings;
    private prevGallerySettings?: TGallerySettings;
    private swiperId?: string;
    private swiperThumbsId?: string;
    private height?: string;
    private galleryContainer?: HTMLElement | null;
    private swiper?: Swiper;
    private galleryThumbs?: Swiper;
    private containerRef = React.createRef<HTMLDivElement>();
    private primaryColor?: string = getStoreItem('palette')?.primaryColor;

    shouldComponentUpdate(nextProps: TCGalleryProps) {
        if (this.prevGallerySettings !== this.gallerySettings) return true;
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
        this.didUpdate();
        window.addEventListener('resize', this.updateDimensions);
    }
    componentDidUpdate() {
        this.didUpdate();
    }

    private didUpdate = () => {
        if (!this.swiperId) return;
        const galleryContainer = document.getElementById(this.swiperId);

        if (this.prevGallerySettings !== this.gallerySettings || this.galleryContainer !== galleryContainer) {
            // init
            this.galleryContainer = galleryContainer;
            this.initGallery();
        } else {
            // update
            this.updateGallery();
        }
        this.updateDimensions();
    }

    private updateDimensions = () => {
        if (!this.containerRef?.current || !this.gallerySettings) return;

        this.containerRef.current.style.width = this.gallerySettings.width ? this.gallerySettings.width + 'px' : '100%';

        let height = this.gallerySettings.height;
        if (this.gallerySettings.ratio) {
            height = this.containerRef.current.clientWidth / this.gallerySettings.ratio;
        }
        if (height) {
            this.containerRef.current.style.height = height + 'px';
        }

    }

    private initGallery = () => {
        if (!this.gallerySettings || !this.swiperId) return;
        const gallerySettings = this.gallerySettings;
        this.prevGallerySettings = gallerySettings;

        let options: SwiperOptions = {
            loop: gallerySettings.loop ?? false,
            direction: gallerySettings.direction ?? 'horizontal',
            breakpoints: gallerySettings.breakpoints,
            slidesPerView: gallerySettings.slidesPerView,
            scrollbar: gallerySettings.showScrollbar && {
                el: '.swiper-scrollbar',
            },
            pagination: gallerySettings.showPagination && {
                el: '.swiper-pagination',
                clickable: true
            },
            navigation: gallerySettings.navigation && {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            zoom: gallerySettings.zoom && {
                toggle: gallerySettings.zoom.zoomOnHover ? false : true
            },
            lazy: gallerySettings.lazy && {
                loadPrevNext: true
            },
            autoHeight: gallerySettings.autoHeight ?? false,
        }
        // filter out undefined values
        options = Object.assign({}, ...Object.keys(options).filter(key => options[key]).map(key => ({ [key]: options[key] })));

        if (gallerySettings.showThumbs) {
            this.galleryThumbs = new Swiper(`#${this.swiperThumbsId}`, {
                spaceBetween: 10,
                slidesPerView: 4,
                grabCursor: true,
                loop: gallerySettings.loop ?? false,
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

        if (gallerySettings.navigation?.showOnHover) {
            this.swiper?.navigation.nextEl?.style.setProperty('display', 'none');
            this.swiper?.navigation.prevEl?.style.setProperty('display', 'none');
        }
    }

    // update or init
    private updateGallery = () => {
        if (!this.gallerySettings || !this.swiperId || !this.swiper) return;

        this.swiper.update();
        this.galleryThumbs?.update();
        this.swiper.slideTo(0);

        if (this.gallerySettings.lazy) {
            this.swiper.lazy?.load();
        }

    }

    private onMouseEnter = () => {
        if (this.gallerySettings?.navigation?.showOnHover) {
            this.swiper?.navigation.nextEl?.style.setProperty('display', 'block');
            this.swiper?.navigation.prevEl?.style.setProperty('display', 'block');
        }

        if (this.swiper && this.gallerySettings?.zoom?.zoomOnHover) {
            this.swiper.zoom.enable();
            this.swiper.zoom.in();
            this.swiper.$el.addClass(styles.swiperZommedIn);
        }
    }

    private onMouseLeave = () => {
        if (this.gallerySettings?.navigation?.showOnHover) {
            this.swiper?.navigation.nextEl?.style.setProperty('display', 'none');
            this.swiper?.navigation.prevEl?.style.setProperty('display', 'none');
        }

        if (this.swiper && this.gallerySettings?.zoom?.zoomOnHover) {
            this.swiper.zoom.out();
            this.swiper.zoom.disable();
            this.swiper.$el.removeClass(styles.swiperZommedIn);
        }
    }

    render() {
        const { gallery: propsSettings, ...rest } = this.props;

        return (
            <CromwellBlock {...rest} type='image'
                content={(data, blockRef, setContentInstance) => {
                    setContentInstance(this);
                    this.gallerySettings = data?.gallery ?? propsSettings;
                    this.swiperId = `swiper-container_${data?.id}`;
                    this.swiperThumbsId = `${this.swiperId}_thumbs`;
                    const gallerySettings = this.gallerySettings;

                    if (!gallerySettings || !(gallerySettings.images || gallerySettings.slides)) return <></>;

                    return (
                        <div className={`swiper-container ${styles.swiperContainer}`}
                            id={this.swiperId}
                            onMouseEnter={this.onMouseEnter}
                            onMouseLeave={this.onMouseLeave}
                            ref={this.containerRef}
                        >
                            <div className={`swiper-wrapper ${styles.swiperWrapper}`} >
                                {gallerySettings.images && gallerySettings.images.map((i, index) => {
                                    let imgItem = (
                                        <img
                                            src={gallerySettings?.lazy ? undefined : i.src}
                                            data-src={gallerySettings?.lazy ? i.src : undefined}
                                            className={`${styles.swiperImage} ${gallerySettings?.lazy ? 'swiper-lazy' : ''} ${gallerySettings.zoom ? 'swiper-zoom-target' : ''}`}
                                            alt={i.alt}
                                            style={{
                                                objectFit: gallerySettings?.objectFit ?? 'cover',
                                            }}
                                        />
                                    );

                                    if (gallerySettings.lazy) {
                                        imgItem = <>{imgItem}
                                            <div className="swiper-lazy-preloader swiper-lazy-preloader-white"
                                                style={{
                                                    border: `4px solid ${this.primaryColor ? this.primaryColor : '#fff'}`,
                                                    borderTopColor: 'transparent'
                                                }}></div>
                                        </>
                                    }

                                    if (gallerySettings.components?.imgWrapper) {
                                        const WrapComp = gallerySettings.components.imgWrapper;
                                        imgItem = <WrapComp image={i}>{imgItem}</WrapComp>
                                    }
                                    if (gallerySettings.zoom) {
                                        imgItem = <div className="swiper-zoom-container">{imgItem}</div>
                                    }

                                    if (i.href) {
                                        imgItem = (
                                            <Link href={i.href}>{imgItem}</Link>
                                        );
                                    }
                                    imgItem = (
                                        <div key={i.src} className={`swiper-slide ${styles.swiperSlide}`}>
                                            {imgItem}
                                        </div>
                                    );

                                    return imgItem;
                                })}
                                {gallerySettings.slides && gallerySettings.slides.map((slideJsx, index) => {
                                    let el = slideJsx;
                                    if (gallerySettings.components?.imgWrapper) {
                                        const WrapComp = gallerySettings.components.imgWrapper;
                                        el = <WrapComp>{el}</WrapComp>
                                    }
                                    if (gallerySettings.zoom) {
                                        el = <div className="swiper-zoom-container">{el}</div>
                                    }
                                    el = (
                                        <div key={`slide_${index}`} className={`swiper-slide ${styles.swiperSlide}`}>
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
                                            const img = i.thumb ?? i.src;
                                            const opt = typeof gallerySettings.showThumbs === 'object' ? gallerySettings.showThumbs : undefined;
                                            return (
                                                <div className={`swiper-slide ${styles.swiperThumb}`}
                                                    key={`${i.src}_${index}`}
                                                    style={{
                                                        backgroundImage: `url(${img})`,
                                                        width: opt?.width ?? '80px',
                                                        height: opt?.height ?? '80px',
                                                    }}></div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                }}
            />
        )
    }
}