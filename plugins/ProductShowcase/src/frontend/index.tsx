import React, { Component, useEffect, useState } from 'react';
import { StaticPageContext, TProductCategory, TProduct, TFrontendPluginProps } from '@cromwell/core';
import { getGraphQLClient, FrontendPlugin, Link } from '@cromwell/core-frontend';
import { useStyles } from './styles';
import { ECommonComponentNames, loadCommonComponent } from '@cromwell/core';
import Swiper, { Navigation, Pagination, SwiperOptions, Lazy, Virtual } from 'swiper';
import { VirtualData } from 'swiper/types/components/virtual';
import { gql } from '@apollo/client';
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

const ProductShowcase = (props: TFrontendPluginProps<ProductShowcaseProps>): JSX.Element => {
    const classes = useStyles();
    const [virtualData, setVirtualData] = useState<VirtualData>({ slides: [] } as any);
    const productShowcaseData = props.data.productShowcase;
    // Try to load component if template has already defined common Product view
    let CommmonProductComp = loadCommonComponent(ECommonComponentNames.ProductCard);
    if (!CommmonProductComp) {
        // Default view otherwise
        CommmonProductComp = (props: { data: TProduct }): JSX.Element => {
            const p = props.data;
            return (
                <div key={p.id}>
                    <img src={p.mainImage} width="300px" />
                    <Link href={`/product/${p.slug}`}><a>{p.name}</a></Link>
                    <p>{p.price}</p>
                </div>
            )

        }
    }
    const swiperId = `swiper-container_ProductShowcase`;
    // console.log('ProductShowcase props', props)
    useEffect(() => {
        const options: SwiperOptions = {
            slidesPerView: 3,
            // slidesPerView: 3,
            // centeredSlides: true,
            spaceBetween: 30,
            // Optional parameters
            direction: 'horizontal',
            virtual: {
                slides: (function () {
                    if (productShowcaseData && productShowcaseData.products &&
                        productShowcaseData.products.elements &&
                        Array.isArray(productShowcaseData.products.elements)) {
                        return productShowcaseData.products.elements;
                    }
                    else return [];
                }()),
                renderExternal: (data) => {
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
                            >{CommmonProductComp && <CommmonProductComp data={slide} />}</div>
                        ))}
                    </div>
                    <div className={`swiper-pagination ${classes.swiperPagination}`}></div>
                    <div className="swiper-button-next"></div>
                    <div className="swiper-button-prev"></div>
                </div>
            </div>
        </div>
    )
}

export const getStaticProps = async (context: StaticPageContext): Promise<ProductShowcaseProps> => {
    let data;
    const limit = 20;
    try {
        data = await getGraphQLClient()?.query({
            query: gql`
                query productShowcase {
                    productShowcase(slug: "1") {
                        id
                        name
                        products(pagedParams: {pageNumber: 1, pageSize: 10}) {
                            pagedMeta {
                                pageSize
                            }
                            elements {
                                id
                                slug
                                name
                                price
                                oldPrice
                                mainImage
                                rating {
                                    average
                                    reviewsNumber
                                }
                            }
                        }
                    }
                }
            `
        });

    } catch (e) {
        console.error('ProductShowcase::getStaticProps', e)
    }

    return {
        productShowcase: data?.data?.productShowcase
    }
}

export default FrontendPlugin(ProductShowcase, 'ProductShowcase');
