import { MuiBreadcrumbs, MuiProductReviews } from '@cromwell/commerce';
import { TAttribute, TGetStaticProps, TProduct, TProductCategory } from '@cromwell/core';
import { BaseEntityHead, CContainer, CPlugin, CText, getGraphQLClient, getGraphQLErrorInfo } from '@cromwell/core-frontend';
import clsx from 'clsx';
import React, { ReactElement } from 'react';

import Layout from '../../components/layout/Layout';
import ProductDetails from '../../components/productDetails/ProductDetails';
import { removeUndefined } from '../../helpers/removeUndefined';
import commonStyles from '../../styles/common.module.scss';
import styles from '../../styles/pages/Product.module.scss';

import type { TPageWithLayout } from '../_app';

export interface ProductProps {
    product?: TProduct | null;
    attributes?: TAttribute[];
    breadcrumbs?: TProductCategory[];
}

const Product: TPageWithLayout<ProductProps> = (props) => {
    const { product } = props ?? {};

    if (product && !product.pageTitle) {
        // Default meta page title
        product.pageTitle = product.name;
    }

    return (
        <CContainer className={clsx(commonStyles.content, styles.ProductPage)} id="product-1">
            <BaseEntityHead
                pageProps={props}
                entity={product}
                image={product?.mainImage}
            />
            <MuiBreadcrumbs data={props.breadcrumbs} className={styles.breadcrumbs} />
            <ProductDetails {...props} />
            <CContainer id="Product_ProductShowcase_container" >
                <CText id="product_showcase-title"
                    style={{
                        margin: '40px 20px 10px 20px',
                        fontWeight: 600,
                        fontSize: '26px'
                    }}
                >Similar items</CText>
                <CPlugin
                    id="Product_ProductShowcase"
                    plugin={{
                        pluginName: "@cromwell/plugin-product-showcase",
                    }}
                />
            </CContainer>
            <CContainer id="product_reviewsBlock" className={styles.reviewsBlock}>
                <MuiProductReviews productId={product?.id} />
            </CContainer>
        </CContainer>
    );
}

Product.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

export default Product;

export const getStaticProps: TGetStaticProps<ProductProps> = async (context) => {
    const slug = context?.params?.slug ?? null;
    const client = getGraphQLClient();

    let product: TProduct | undefined = undefined;
    if (slug && typeof slug === 'string') {
        try {
            product = await client.getProductBySlug(slug);
        } catch (e) {
            console.error('Product::getStaticProps', getGraphQLErrorInfo(e))
        }
    } else {
        console.error('Product::getStaticProps: slug is invalid')
    }

    if (!product) {
        return {
            notFound: true,
        }
    }

    let attributes: TAttribute[] | undefined;

    try {
        attributes = await client?.getAttributes();
    } catch (e) {
        console.error('Product::getStaticProps', getGraphQLErrorInfo(e))
    }

    const breadcrumbs = await MuiBreadcrumbs.getData(product?.id);

    return {
        props: removeUndefined({
            product,
            attributes,
            breadcrumbs,
        })
    }
}

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: 'blocking',
    };
}
