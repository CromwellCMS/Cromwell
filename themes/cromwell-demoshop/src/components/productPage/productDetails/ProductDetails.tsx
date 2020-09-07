import { getAppCustomConfigProp, TAttribute, TProduct, TProductReview } from '@cromwell/core';
import {
    CContainer, CGallery, CImage, CList, CText, getGraphQLClient,
    getCStore, ProductAttributes
} from '@cromwell/core-frontend';
import { Rating } from '@material-ui/lab';
import { Button } from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { useState, useRef, useEffect } from 'react';

import { LoadBox } from '../../loadbox/Loadbox';
import { Pagination } from '../../pagination/Pagination';
import { SwipeableTabs } from '../../tabs/Tabs';
import { ProductActions } from '../../productPage/actions/ProductActions';
import { ReviewItem } from '../../productPage/reviewItem/ReviewItem';
import { observer } from "mobx-react";
//@ts-ignore
import styles from './ProductDetails.module.scss';


export const ProductDetails = observer((props: {
    product?: TProduct | null;
    attributes?: TAttribute[];
}) => {
    const productRef = useRef(props.product);
    const modifiedProductRef = useRef(props.product);
    const [pickedAttributes, setPickedAttributes] = useState({});
    const cstore = getCStore();

    if (props.product && props.product !== productRef.current) {
        productRef.current = props.product;
        modifiedProductRef.current = props.product;
    }
    const product = modifiedProductRef.current;
    const router = useRouter();
    const customTabs = getAppCustomConfigProp('product/customTabs');
    const client = getGraphQLClient();

    useEffect(() => {
        if (product) cstore.addToWatchedItems({ product })
    }, []);

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
                            <div className={styles.ratingBlock}>
                                <Rating name="read-only" value={product?.rating?.average} precision={0.5} readOnly />
                                {product?.rating?.reviewsNumber ? (
                                    <p className={styles.ratingCaption}>
                                        {product?.rating?.average ? product?.rating?.average.toFixed(2) : ''} based on {product?.rating?.reviewsNumber} reviews.</p>
                                ) : null}
                            </div>
                            <CContainer id="product_5" className={styles.priceBlock}>
                                {(product?.oldPrice !== undefined && product.oldPrice !== null) && (
                                    <CText id="product_6" className={styles.oldPrice}>{cstore.getPriceWithCurrency(product.oldPrice)}</CText>
                                )}
                                <CText id="product_7" className={styles.price}>{cstore.getPriceWithCurrency(product.price)}</CText>
                            </CContainer>
                            <CContainer id="productAttributesBlock" className={styles.productAttributesBlock}>
                                {productRef.current && props.attributes && (
                                    <ProductAttributes
                                        attributes={props.attributes}
                                        product={productRef.current}
                                        onChange={(attrs, modified) => {
                                            modifiedProductRef.current = modified;
                                            setPickedAttributes(attrs);
                                        }}
                                        elements={{
                                            attributeValue: (attrProps) => {
                                                return (
                                                    <Button
                                                        onClick={attrProps.onClick}
                                                        variant={attrProps.isChecked ? 'contained' : 'outlined'}
                                                        className={styles.attrValue}
                                                    >
                                                        {attrProps.icon && (
                                                            <div
                                                                style={{ backgroundImage: `url(${attrProps.icon}` }}
                                                                className={styles.attrValueIcon}></div>
                                                        )}
                                                        <p style={{ textTransform: 'none' }}>{attrProps.value}</p>
                                                    </Button>
                                                )
                                            }
                                        }}
                                    />
                                )}
                            </CContainer>
                            <CContainer id="productActionsBlock">
                                <ProductActions
                                    product={product}
                                    pickedAttributes={pickedAttributes}
                                />
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
                                        dangerouslySetInnerHTML={(product?.description) ? { __html: product.description } : undefined}>
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
                            <CImage id="main_09" src="/themes/cromwell-demoshop/free_shipping.png" />
                            <CContainer id="main_11" className={styles.advantageItemText}>
                                <CText id="main_06" className={styles.advantageItemHeader}>FREE SHIPPING & RETURN</CText>
                            </CContainer>
                        </CContainer>
                        <CContainer id="main_03" className={styles.advantageItem}>
                            <CImage id="main_09" src="/themes/cromwell-demoshop/wallet.png" />
                            <CContainer id="main_13" className={styles.advantageItemText}>
                                <CText id="main_07" className={styles.advantageItemHeader}>MONEY BACK GUARANTEE</CText>
                            </CContainer>
                        </CContainer>
                        <CContainer id="main_04" className={styles.advantageItem}>
                            <CImage id="main_09" src="/themes/cromwell-demoshop/technical-support.png" />
                            <CContainer id="main_10" className={styles.advantageItemText}>
                                <CText id="main_08" className={styles.advantageItemHeader} >ONLINE SUPPORT 24/7</CText>
                            </CContainer>
                        </CContainer>
                    </CContainer>
                    <CImage id="product_10" src="/themes/cromwell-demoshop/sub_banner_3.jpg"
                        className={styles.infoBanner} link="/category/1" withEffect={true} />
                </CContainer>
            </>)}
        </CContainer>

    )
})
