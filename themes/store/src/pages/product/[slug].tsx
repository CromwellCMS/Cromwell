import { gql } from '@apollo/client';
import { TAttribute, TCromwellPage, TGetStaticProps, TProduct, TProductCategory } from '@cromwell/core';
import { CContainer, CText, getGraphQLClient, getGraphQLErrorInfo } from '@cromwell/core-frontend';
import React from 'react';

import Layout from '../../components/layout/Layout';

import { getBreadcrumbs } from '../../helpers/getBreadcrumbs';
import ProductDetails from '../../components/productDetails/ProductDetails';
import Breadcrumbs from '../../components/productDetails/breadcrumbs/Breadcrumbs';
import commonStyles from '../../styles/common.module.scss';
import styles from '../../styles/pages/Product.module.scss';
import clsx from 'clsx';

export interface ProductProps {
    product?: TProduct | null;
    attributes?: TAttribute[];
    breadcrumbs?: TProductCategory[];
}

const Product: TCromwellPage<ProductProps> = (props) => {
    return (
        <Layout>
            <div className={clsx(commonStyles.content, styles.ProductPage)}>
                {!!props.breadcrumbs?.length && (
                    <div className={styles.breadcrumbs}>
                        <Breadcrumbs breadcrumbs={props.breadcrumbs} />
                    </div>
                )}
                <ProductDetails {...props} />
                <CText
                    id="product_showcase-title"
                    style={{
                        margin: '40px 20px 10px 20px',
                        fontWeight: 600,
                        fontSize: '26px'
                    }}
                >Featured items</CText>
                <CContainer id="Product_ProductShowcase" />
            </div>
        </Layout>
    );
}

export default Product;

export const getStaticProps: TGetStaticProps = async (context): Promise<ProductProps> => {
    const slug = context?.params?.slug ?? null;
    // console.log('ProductThemePage::getStaticProps: pid', slug, 'context.params', context?.params)
    const client = getGraphQLClient();

    let product: TProduct | undefined = undefined;
    if (slug && typeof slug === 'string') {
        try {
            product = await client.getProductBySlug(slug, gql`
                ${client.ProductFragment}
                fragment ProductListFragment on Product {
                    ...ProductFragment
                    categories(pagedParams: {
                      pageSize: 1
                    }) {
                      id
                      name
                    }
                }
            `, 'ProductListFragment');
        } catch (e) {
            console.error('Product::getStaticProps', e, getGraphQLErrorInfo(e))
        }
    } else {
        console.error('Product::getStaticProps: !pid')
    }


    let attributes: TAttribute[] | undefined;

    try {
        attributes = await client?.getAttributes();
    } catch (e) {
        console.error('Product::getStaticProps', e, getGraphQLErrorInfo(e))
    }

    // Breadcrumbs
    const breadcrumbs = await getBreadcrumbs(product);

    return {
        product,
        attributes,
        breadcrumbs,
    }
}

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: true
    };
}
