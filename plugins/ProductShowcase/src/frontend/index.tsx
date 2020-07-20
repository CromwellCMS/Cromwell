import React, { Component, useEffect, useState } from 'react';
import { StaticPageContext, TProductCategory } from '@cromwell/core';
import { getGraphQLClient, FrontendPlugin, Link } from '@cromwell/core-frontend';
import { ProductShowcaseReviewsType } from '../backend/entities/ProductShowcaseReviews';
import { useStyles } from './styles';
import { ECommonComponentNames, loadCommonComponent } from '@cromwell/core';
import Swiper, { Navigation, Pagination, SwiperOptions, Lazy, Virtual } from 'swiper';
import { VirtualData } from 'swiper/types/components/virtual';
//@ts-ignore
import styleInject from 'style-inject';
//@ts-ignore
import swiperCSS from "swiper/swiper-bundle.css";
// styleInject(swiperCSS);

//@ts-ignore
import styles from './CGallery.module.scss';
Swiper.use([Navigation, Pagination, Virtual]);

interface ProductShowcaseProps {
    productShowcase?: TProductCategory;
}

const ProductShowcase = (props: ProductShowcaseProps) => {
    const classes = useStyles();
    const [virtualData, setVirtualData] = useState<VirtualData>({ slides: [] } as any);
    const CommmonProductComp = loadCommonComponent(ECommonComponentNames.product);
    const swiperId = `swiper-container_ProductShowcase`;
    // console.log('ProductShowcase props', props)
    useEffect(() => {
        const options: SwiperOptions = {
            slidesPerView: 3,
            // slidesPerView: 3,
            centeredSlides: true,
            spaceBetween: 30,
            // Optional parameters
            direction: 'horizontal',
            virtual: {
                slides: (function () {
                    if (props.productShowcase && props.productShowcase.products &&
                        Array.isArray(props.productShowcase.products)) {
                        return props.productShowcase.products;
                    }
                    else return [];
                    // props.productShowcase && props.productShowcase.products && props.productShowcase.products.map(p => {
                    //     if (CommmonProductComp) {
                    //         return <CommmonProductComp data={p} key={p.id} />
                    //     }
                    //     else return (
                    //         <div key={p.id}>
                    //             <Link href="/product/[slug]" as={`/product/${p.slug}`}><a>Name: {p.name}</a></Link>
                    //             <p>Price: {p.price}</p>
                    //             <h1>id: {p.id}</h1>
                    //         </div>
                    //     )
                    // })
                }()),
                renderExternal: (data) => {
                    console.log('setVirtualData', data);
                    setVirtualData(data)
                }
            },
        }
        options.pagination = {
            el: '.swiper-pagination',
            clickable: true
        }
        options.navigation = {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        }

        const swiper = new Swiper(`#${swiperId}`, options);

        setTimeout(() => swiper.update(), 100);
    }, [])
    return (
        <div className={classes.wrapper}>
            <h3 className={classes.title}>Featured items</h3>
            <div className={classes.list}>
                <div className={`swiper-container ${classes.swiperContainer}`} id={swiperId}>
                    <div className="swiper-wrapper">
                        {/* It is important to set "left" style prop on every slide */}
                        {virtualData.slides.map((slide, index) => (
                            <div className="swiper-slide"
                                key={index}
                                style={{ left: `${virtualData.offset}px` }}
                            ><CommmonProductComp data={slide} /></div>
                        ))}
                    </div>
                    <div className="swiper-pagination"></div>
                    <div className="swiper-button-next"></div>
                    <div className="swiper-button-prev"></div>
                </div>
            </div>
        </div>
    )
}

export const getStaticProps = async (context: StaticPageContext): Promise<ProductShowcaseProps> => {
    let data = {};
    const limit = 20;
    try {
        const products = await getGraphQLClient().request(`
        query productShowcase {
            productShowcase(slug: "1") {
                id
                name
                products(pagedParams: {pageNumber: 1, pageSize: 10}) {
                    id
                    slug
                    name
                    price
                    mainImage
              }
            }
          }
        `);
        data = {
            productShowcase: products.productShowcase,
        }
    } catch (e) {
        console.error('ProductShowcase::getStaticProps', e)
    }

    return {
        ...data
    }
}

export default FrontendPlugin<ProductShowcaseProps>(ProductShowcase, 'ProductShowcase');
