import React from 'react';
import { TCromwellPage, TProduct, TGetStaticProps, getAppCustomConfigProp } from '@cromwell/core';
import { CImage, CText } from '@cromwell/core-frontend'
import { CContainer, getGraphQLClient, getPriceWithCurrency, CGallery } from '@cromwell/core-frontend';
import Layout from '../../components/layout/Layout';
import { SwipeableTabs } from '../../components/tabs/Tabs';
import { Rating } from '@material-ui/lab';
import { useRouter } from 'next/router';
import { LoadBox } from '../../components/loadbox/Loadbox';
//@ts-ignore
import commonStyles from '../../styles/common.module.scss';
//@ts-ignore
import styles from '../../styles/pages/Product.module.scss';

interface ProductProps {
    product?: TProduct | null;
}
const Product: TCromwellPage<ProductProps> = (props) => {
    // console.log('ProductThemePage props', props);
    const router = useRouter();
    const product = props.product;
    const customTabs = getAppCustomConfigProp('product/customTabs');
    return (
        <Layout>
            <div className={`${commonStyles.content} ${styles.ProductPage}`}>
                <CContainer id="product_01" className={styles.product}>
                    {(!product && router && router.isFallback) && (
                        <LoadBox />
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
                                        }
                                    }} />
                                </CContainer>
                                <CContainer id="product_3" className={styles.captionBlock}>
                                    <CText id="product_4" className={styles.productName} type="h1">{product?.name}</CText>
                                    <Rating name="read-only" value={product.rating} precision={0.5} readOnly className={styles.productRating} />

                                    <CContainer id="product_5" className={styles.priceBlock}>
                                        {product.oldPrice && (
                                            <CText id="product_6" className={styles.oldPrice}>{getPriceWithCurrency(product.oldPrice)}</CText>
                                        )}
                                        <CText id="product_7" className={styles.price}>{getPriceWithCurrency(product.price)}</CText>
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
                                                <p>Reviews</p>
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
                <CContainer id="3" />
            </div>
        </Layout>
    );
}

export default Product;

export const getStaticProps: TGetStaticProps = async (context): Promise<ProductProps> => {
    // console.log('context', context)
    const slug = (context && context.params) ? context.params.slug : null;
    console.log('ProductThemePage::getStaticProps: pid', slug, 'context.params', context.params)
    let data: TProduct | null = null;
    if (slug && typeof slug === 'string') {
        try {
            data = await getGraphQLClient().getProductBySlug(slug, false);
        } catch (e) {
            console.error('Product::getStaticProps', e)
        }
    } else {
        console.error('Product::getStaticProps: !pid')
    }

    return {
        product: data
    }

}

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: true
    };
}

