import { gql } from '@apollo/client';
import {
    ECommonComponentNames,
    loadCommonComponent,
    StaticPageContext,
    TFrontendPluginProps,
    TPagedList,
    TProduct,
    TProductCategory,
} from '@cromwell/core';
import { getGraphQLClient, Link } from '@cromwell/core-frontend';
import React, { useEffect, useState } from 'react';
import { Navigation, Pagination, Swiper, SwiperOptions, Virtual } from 'swiper';
import { VirtualData } from 'swiper/types/components/virtual';

import { useStyles } from './styles';
import "swiper/swiper-bundle.css";

Swiper.use([Navigation, Pagination, Virtual]);

type ProductShowcaseProps = {
    productShowcase?: TPagedList<TProduct>;
}

const ProductShowcase = (props: TFrontendPluginProps<ProductShowcaseProps>): JSX.Element => {
    const classes = useStyles();
    const [virtualData, setVirtualData] = useState<VirtualData>({ slides: [] } as any);
    const productShowcaseData = props.data?.productShowcase;
    // Try to load component if a Theme has already defined common Product view
    let CommmonProductComp = loadCommonComponent(ECommonComponentNames.ProductCard);
    if (!CommmonProductComp) {
        // Default view otherwise
        CommmonProductComp = (props: { data?: TProduct | undefined }): JSX.Element => {
            const p = props.data;
            if (p) return (
                <div key={p.id}>
                    <img src={p?.mainImage} width="300px" />
                    <Link href={`/product/${p.slug}`}><a>{p.name}</a></Link>
                    <p>{p.price}</p>
                </div>
            )
            else return <></>
        }
    }
    const swiperId = `swiper-container_ProductShowcase`;
    // console.log('ProductShowcase props', props)
    useEffect(() => {
        const options: SwiperOptions = {
            slidesPerView: 2,
            breakpoints: {
                640: {
                    slidesPerView: 3,
                    spaceBetween: 10,
                },
                768: {
                    slidesPerView: 4,
                    spaceBetween: 10,
                },
                1024: {
                    slidesPerView: 5,
                    spaceBetween: 10,
                },
            },
            // slidesPerView: 3,
            // centeredSlides: true,
            spaceBetween: 10,
            // Optional parameters
            direction: 'horizontal',
            virtual: {
                slides: (function () {
                    if (productShowcaseData?.elements &&
                        Array.isArray(productShowcaseData.elements)) {
                        return productShowcaseData.elements;
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
    }, []);


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
    // slug of a product page
    const slug = context?.params?.slug ?? null;
    let data;
    const limit = 20;
    try {
        data = await getGraphQLClient('plugin')?.query({
            query: gql`
                query productShowcase($slug: String) {
                    productShowcase(slug: $slug) {
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
            `,
            variables: {
                slug
            }
        });

    } catch (e) {
        console.error('ProductShowcase::getStaticProps', e, JSON.stringify(e?.result?.errors ?? null), null, 2)
    }

    return {
        productShowcase: data?.data?.productShowcase
    }
}

export default ProductShowcase;
