import { getThemeCustomConfigProp, TAttribute, TCromwellBlock, TProduct, TProductReview } from '@cromwell/core';
import { CContainer, CGallery, CImage, CList, TCList, CText, getCStore, getGraphQLClient, useRouter } from '@cromwell/core-frontend';
import { Rating } from '@material-ui/lab';
import React, { useEffect, useRef } from 'react';

import { LoadBox } from '../loadbox/Loadbox';
import { Pagination } from '../pagination/Pagination';
import { ProductActions } from './actions/ProductActions';
import { ReviewItem } from './reviewItem/ReviewItem';
import { SwipeableTabs } from '../tabs/Tabs';
import ReviewForm from './reviewForm/ReviewForm';
import styles from './ProductDetails.module.scss';

export default function ProductDetails(props: {
    product?: TProduct | null;
    attributes?: TAttribute[];
    compact?: boolean;
}) {
    const productRef = useRef(props.product);
    const reviewsRef = useRef<TCromwellBlock<TCList> | null | undefined>(null);
    const modifiedProductRef = useRef(props.product);
    const cstore = getCStore();

    if (props.product && props.product !== productRef.current) {
        productRef.current = props.product;
        modifiedProductRef.current = props.product;
    }
    const product = modifiedProductRef.current;
    const router = useRouter?.();
    const customTabs = getThemeCustomConfigProp('product/customTabs');
    const client = getGraphQLClient();

    useEffect(() => {
        if (product) cstore.addToWatchedItems({ product });
    }, [props.product]);

    useEffect(() => {
        const list = reviewsRef.current?.getContentInstance();
        if (list) {
            list.clearState();
            list.init();
        }
    }, [router?.asPath]);

    return (
        <CContainer id="product_01" className={styles.ProductDetails + (props.compact ? ' ' + styles.compact : '')}>
            {(!product && router && router.isFallback) && (
                <LoadBox />
            )}
            {(!product && !(router && router.isFallback)) && (
                <div className={styles.productNotFound}>
                    <h3>Product not found</h3>
                </div>
            )}
            {product && (<>
                <CContainer id="product_0" className={styles.imageAndCaptionBlock}>
                    <CContainer id="product_2" className={styles.imageBlock}>
                        <CGallery id="product_1" gallery={{
                            images: product.images ? product.images.map(i => {
                                return {
                                    src: i
                                }
                            }) : [],
                            loop: false,
                            navigation: {
                                showOnHover: true
                            },
                            zoom: {
                                zoomOnHover: true
                            },
                            thumbs: {
                                width: 80,
                                height: 80,
                            },
                            fullscreen: true,
                            // width: 400,
                            // height: 400,
                            responsive: {
                                0: {
                                    ratio: 1,
                                    visibleSlides: 1,
                                },
                                700: {
                                    ratio: 1,
                                    visibleSlides: 2,
                                    height: 600
                                }
                            },
                        }} />
                    </CContainer>
                    <CContainer id="product_3" className={styles.captionBlock}>
                        <CContainer id="product_4">
                            <h1 className={styles.productName}>{product?.name}</h1>
                        </CContainer>
                        <div className={styles.ratingBlock}>
                            <Rating name="read-only" value={product?.rating?.average} precision={0.5} readOnly />
                            {product?.rating?.reviewsNumber ? (
                                <p className={styles.ratingCaption}>
                                    {product?.rating?.average ? product?.rating?.average.toFixed(2) : ''} based on {product?.rating?.reviewsNumber} reviews.</p>
                            ) : null}
                        </div>
                        <CContainer id="product_5" className={styles.priceBlock}>
                            {(product?.oldPrice !== undefined && product.oldPrice !== null) && (
                                <p className={styles.oldPrice}>{cstore.getPriceWithCurrency(product.oldPrice)}</p>
                            )}
                            <p className={styles.price}>{cstore.getPriceWithCurrency(product.price)}</p>
                        </CContainer>
                        <CContainer id="productActionsBlock">
                            <ProductActions
                                onAttrChange={(attrs, modified) => {
                                    modifiedProductRef.current = modified;
                                }}
                                attributes={props.attributes}
                                product={product}
                            />
                        </CContainer>
                    </CContainer>
                </CContainer>

                <CContainer id="product_31" className={styles.tabsAndSidebar}>
                    <CContainer id="product_11" className={styles.tabsBlock}>
                        <SwipeableTabs
                            classes={{ header: styles.tabsHeader }}
                            tabs={[
                                {
                                    label: 'Details',
                                    node: (
                                        <div className={styles.tab} >
                                            <div className={styles.tabDescription}
                                                dangerouslySetInnerHTML={(product?.description) ? { __html: product.description } : undefined}
                                            ></div>
                                        </div>
                                    )
                                },
                                {
                                    label: 'Reviews',
                                    node: (
                                        <div
                                            className={styles.tab}
                                        >
                                            <CList<TProductReview>
                                                blockRef={(block) => { reviewsRef.current = block as any }}
                                                id={"ProductPage_ReviewList"}
                                                ListItem={(props) => <ReviewItem data={props.data} key={props.data?.id} />}
                                                usePagination
                                                useShowMoreButton
                                                disableCaching
                                                pageSize={10}
                                                maxDomPages={2}
                                                // scrollContainerSelector={`.${layoutStyles.Layout}`}
                                                loader={async (params) => {
                                                    return client?.getFilteredProductReviews({
                                                        pagedParams: params,
                                                        filterParams: {
                                                            productId: product.id + '',
                                                            approved: true,
                                                        }
                                                    });
                                                }}
                                                elements={{
                                                    pagination: Pagination
                                                }}
                                            />
                                            <ReviewForm productId={product.id} />
                                        </div>
                                    )
                                },
                                ...((customTabs && Array.isArray(customTabs)) ? customTabs.map(t => ({
                                    label: t.label,
                                    node: (
                                        <div
                                            className={styles.tab}
                                            dangerouslySetInnerHTML={(t.html) ? { __html: t.html } : undefined}>
                                        </div>
                                    )
                                })) : [])
                            ]} />
                    </CContainer>
                    {!props.compact && (
                        <CContainer id="product_8" className={styles.infoBlock}>
                            <CContainer id="product_9" className={styles.advantagesBlock}>
                                <CContainer id="main_02" className={styles.advantageItem}>
                                    <CImage id="main_09" src="/themes/@cromwell/theme-store/free_shipping.png" />
                                    <CContainer id="main_11" className={styles.advantageItemText}>
                                        <CText id="main_06" className={styles.advantageItemHeader}>FREE SHIPPING & RETURN</CText>
                                    </CContainer>
                                </CContainer>
                                <CContainer id="main_03" className={styles.advantageItem}>
                                    <CImage id="main_09" src="/themes/@cromwell/theme-store/wallet.png" />
                                    <CContainer id="main_13" className={styles.advantageItemText}>
                                        <CText id="main_07" className={styles.advantageItemHeader}>MONEY BACK GUARANTEE</CText>
                                    </CContainer>
                                </CContainer>
                                <CContainer id="main_04" className={styles.advantageItem}>
                                    <CImage id="main_09" src="/themes/@cromwell/theme-store/technical-support.png" />
                                    <CContainer id="main_10" className={styles.advantageItemText}>
                                        <CText id="main_08" className={styles.advantageItemHeader} >ONLINE SUPPORT 24/7</CText>
                                    </CContainer>
                                </CContainer>
                            </CContainer>
                            <CImage id="product_10" src="/themes/@cromwell/theme-store/sub_banner_3.jpg"
                                className={styles.infoBanner} imgLink="/category/1" withEffect={true} />
                        </CContainer>
                    )}
                </CContainer>
            </>)}
        </CContainer>

    )
}

