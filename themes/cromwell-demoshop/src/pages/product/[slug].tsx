import React from 'react';
import { TCromwellPage, TProduct, TGetStaticProps } from '@cromwell/core';
import { CImage, CText } from '@cromwell/core-frontend'
import { CContainer, getGraphQLClient, getPriceWithCurrency, CGallery } from '@cromwell/core-frontend';
import Layout from '../../components/layout/Layout';
import { Rating } from '@material-ui/lab';
import { LoadBox } from '../../components/loadbox/Loadbox';
//@ts-ignore
import commonStyles from '../../styles/common.module.scss';
//@ts-ignore
import styles from '../../styles/pages/Product.module.scss';


interface ProductProps {
    data?: {
        product: TProduct;
    };
}
const Product: TCromwellPage<ProductProps> = (props) => {
    console.log('ProductThemePage props', props);
    const product = props.data ? props.data.product : undefined;
    return (
        <Layout>
            <div className={`${commonStyles.content} ${styles.ProductPage}`}>
                <CContainer id="product_0" className={styles.mainBlock}>
                    {(!product) && (
                        <LoadBox />
                    )}
                    {product && (<>
                        <CContainer id="product_2" className={styles.imageBlock}>
                            {product.images && (
                                <CGallery id="product_1" settings={{
                                    images: product.images.map(i => {
                                        return {
                                            src: i
                                        }
                                    }),
                                    loop: false,
                                    ratio: 1,
                                    showThumbs: {
                                        width: '80px',
                                        height: '80px',
                                    },
                                    showNav: true
                                }} />
                            )}
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
                    </>)}
                </CContainer>
                <CContainer id="3" />
            </div>
        </Layout>
    );
}

export default Product;

export const getStaticProps: TGetStaticProps = async (context) => {
    // console.log('context', context)
    const slug = (context && context.params) ? context.params.slug : null;
    console.log('ProductThemePage::getStaticProps: pid', slug, 'context.params', context.params)
    let data = null;
    if (slug) {
        try {
            data = await getGraphQLClient().request(
                `query getproduct {
                    product(slug: "${slug}") {
                        id
                        slug
                        name
                        pageTitle
                        price
                        oldPrice
                        mainImage
                        images
                        rating
                    }
                }
            `);
        } catch (e) {
            console.error('Product::getStaticProps', e)
        }
    } else {
        console.error('Product::getStaticProps: !pid')
    }

    return {
        data: data
    }

}

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: true
    };
}

