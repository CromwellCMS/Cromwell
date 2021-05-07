import 'swiper/swiper-bundle.css';

import { gql } from '@apollo/client';
import {
    ECommonComponentNames,
    getCommonComponent,
    getRandStr,
    StaticPageContext,
    TAttribute,
    TFrontendPluginProps,
    TPagedList,
    TProduct,
} from '@cromwell/core';
import { getGraphQLClient, Link } from '@cromwell/core-frontend';
import React, { useEffect, useRef, useState } from 'react';
import { Navigation, Pagination, Swiper, SwiperOptions, Virtual } from 'swiper';
import { VirtualData } from 'swiper/types/components/virtual';

import { useStyles } from './styles';

Swiper.use([Navigation, Pagination, Virtual]);

type ProductShowcaseProps = {
    productShowcase?: TPagedList<TProduct>;
    attributes?: TAttribute[];
}

const ProductShowcase = (props: TFrontendPluginProps<ProductShowcaseProps>): JSX.Element => {
    const swiperId = useRef(`swiper-container_ProductShowcase_${getRandStr(5)}`);
    const classes = useStyles();
    const [virtualData, setVirtualData] = useState<VirtualData>({ slides: [] } as any);
    const productShowcaseData = props.data?.productShowcase;
    const attributes = props.data?.attributes;
    // Try to load component if a Theme has already defined common Product view
    let CommmonProductComp = getCommonComponent(ECommonComponentNames.ProductCard);
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
            else return <></>;
        }
    }
    // console.log('ProductShowcase render props', props)
    
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
                slides: productShowcaseData?.elements ?? [],
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

        const swiper = new Swiper(`#${swiperId.current}`, options);

        setTimeout(() => swiper.update(), 100);
    }, []);


    return (
        <div className={classes.wrapper}>
            <div className={classes.list}>
                <div className={`swiper-container ${classes.swiperContainer}`} id={swiperId.current}>
                    <div className="swiper-wrapper">
                        {/* It is important to set "left" style prop on every slide */}
                        {virtualData.slides.map((slide, index) => (
                            <div className="swiper-slide"
                                key={index}
                                style={{ left: `${virtualData.offset}px` }}
                            >{CommmonProductComp && <CommmonProductComp data={slide} attributes={attributes} />}</div>
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
    const client = getGraphQLClient('plugin');
    const slug = context?.params?.slug ?? null;
    let data;
    try {
        data = await client?.query({
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

    let attributes: TAttribute[] | undefined;
    try {
        attributes = await client?.getAttributes();
    } catch (e) {
        console.error('Product::getStaticProps', e)
    }

    return {
        attributes,
        productShowcase: data?.data?.productShowcase
    }
}

export default ProductShowcase;