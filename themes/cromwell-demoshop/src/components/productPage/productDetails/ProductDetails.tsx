import { getAppCustomConfigProp, TAttribute, TProduct, TProductReview } from '@cromwell/core';
import { CContainer, CGallery, CImage, CList, CText, getGraphQLClient, getPriceWithCurrency } from '@cromwell/core-frontend';
import { Rating } from '@material-ui/lab';
import { useRouter } from 'next/router';
import React, { useState, useRef, useEffect } from 'react';

import { LoadBox } from '../../loadbox/Loadbox';
import { Pagination } from '../../pagination/Pagination';
import { ProductActions } from '../../productPage/actions/ProductActions';
import { ProductAttributes } from '../../productPage/attributes/ProductAttributes';
import { ReviewItem } from '../../productPage/reviewItem/ReviewItem';
import { SwipeableTabs } from '../../tabs/Tabs';
//@ts-ignore
import styles from './ProductDetails.module.scss';

export const ProductDetails = (props: {
    product?: TProduct | null;
    attributes?: TAttribute[];
}) => {
    const [product, setProduct] = useState(props.product);
    const productRef = useRef<TProduct | null | undefined>(props.product);

    const router = useRouter();
    const productOriginal = props.product;
    const customTabs = getAppCustomConfigProp('product/customTabs');
    const client = getGraphQLClient();

    useEffect(() => {
        if (props.product !== productRef.current) {
            productRef.current = props.product;
            setProduct(props.product);
        }
    });

    return (
        <CContainer id="product_01" className={styles.ProductDetails}>
            {(!product && router && router.isFallback) && (
                <LoadBox />
            )}
            {(!product && !(router && router.isFallback)) && (
                <div className={styles.productNotFound}>
                    <h3>Product not found</h3>
                </div>
            )}
            {product && (<>
                <CContainer id="product_0" className={styles.mainBlock}>
                    <CContainer id="product_0" className={styles.imageAndCaptionBlock}>
                        <CContainer id="product_2" className={styles.imageBlock}>
                            <CGallery id="product_1" settings={{
                                images: product.images ? product.images.map(i => {
                                    return {
                                        src: i
                                    }
                                }) : [],
                                loop: false,
                                ratio: 1,
                                showThumbs: {
                                    width: '80px',
                                    height: '80px',
                                },
                                navigation: {
                                    showOnHover: true
                                },
                                zoom: {
                                    zoomOnHover: true
                                },
                                backgroundSize: 'contain'
                            }} />
                        </CContainer>
                        <CContainer id="product_3" className={styles.captionBlock}>
                            <CText id="product_4" className={styles.productName} type="h1">{product?.name}</CText>
                            <Rating name="read-only" value={product.rating} precision={0.5} readOnly className={styles.productRating} />

                            <CContainer id="product_5" className={styles.priceBlock}>
                                {(product?.oldPrice !== undefined && product.oldPrice !== null) && (
                                    <CText id="product_6" className={styles.oldPrice}>{getPriceWithCurrency(product.oldPrice)}</CText>
                                )}
                                <CText id="product_7" className={styles.price}>{getPriceWithCurrency(product.price)}</CText>
                            </CContainer>
                            <CContainer id="productAttributesBlock" className={styles.productAttributesBlock}>
                                {product.attributes && props.attributes && (
                                    <ProductAttributes
                                        product={productOriginal}
                                        modifyProduct={(modifiedProduct) => {
                                            console.log('modifyProduct', modifiedProduct);
                                            setProduct(modifiedProduct)
                                        }}
                                        attributes={props.attributes}
                                        productAttributes={product.attributes}
                                    />
                                )}
                            </CContainer>
                            <CContainer id="productActionsBlock">
                                <ProductActions />
                            </CContainer>
                        </CContainer>
                    </CContainer>
                    <CContainer id="product_11" className={styles.tabsBlock}>
                        <SwipeableTabs tabs={[
                            {
                                label: 'Details',
                                node: (
                                    <div
                                        className={styles.tab}
                                        dangerouslySetInnerHTML={(product && product.description) ? { __html: product.description } : undefined}>
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
                                            id={"ProductPage_ReviewList"}
                                            ListItem={(props) => <ReviewItem data={props.data} key={props.data?.id} />}
                                            usePagination
                                            useShowMoreButton
                                            disableCaching
                                            pageSize={10}
                                            maxDomPages={2}
                                            // scrollContainerSelector={`.${layoutStyles.Layout}`}
                                            loader={async (params) => {
                                                return client?.getProductReviewsOfProduct(product.id, params);
                                            }}
                                            elements={{
                                                pagination: Pagination
                                            }}
                                        />
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
                </CContainer>

                <CContainer id="product_8" className={styles.infoBlock}>
                    <CContainer id="product_9" className={styles.advantagesBlock}>
                        <CContainer id="main_02" className={styles.advantageItem}>
                            <CImage id="main_09" src="/images/free_shipping.png" />
                            <CContainer id="main_11" className={styles.advantageItemText}>
                                <CText id="main_06" className={styles.advantageItemHeader}>FREE SHIPPING & RETURN</CText>
                            </CContainer>
                        </CContainer>
                        <CContainer id="main_03" className={styles.advantageItem}>
                            <CImage id="main_09" src="/images/wallet.png" />
                            <CContainer id="main_13" className={styles.advantageItemText}>
                                <CText id="main_07" className={styles.advantageItemHeader}>MONEY BACK GUARANTEE</CText>
                            </CContainer>
                        </CContainer>
                        <CContainer id="main_04" className={styles.advantageItem}>
                            <CImage id="main_09" src="/images/technical-support.png" />
                            <CContainer id="main_10" className={styles.advantageItemText}>
                                <CText id="main_08" className={styles.advantageItemHeader} >ONLINE SUPPORT 24/7</CText>
                            </CContainer>
                        </CContainer>
                    </CContainer>
                    <CImage id="product_10" src="/images/sub_banner_3.jpg"
                        className={styles.infoBanner} link="/category/1" withEffect={true} />
                </CContainer>
            </>)}
        </CContainer>

    )
}
