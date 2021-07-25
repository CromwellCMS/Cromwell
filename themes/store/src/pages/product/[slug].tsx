import { gql } from '@apollo/client';
import { TAttribute, TCromwellPage, TGetStaticProps, TProduct, TProductCategory, TProductReview } from '@cromwell/core';
import { CContainer, CList, CText, getGraphQLClient, getGraphQLErrorInfo } from '@cromwell/core-frontend';
import clsx from 'clsx';
import React from 'react';

import Layout from '../../components/layout/Layout';
import { Pagination } from '../../components/pagination/Pagination';
import Breadcrumbs from '../../components/productDetails/breadcrumbs/Breadcrumbs';
import ProductDetails from '../../components/productDetails/ProductDetails';
import ReviewForm from '../../components/productDetails/reviewForm/ReviewForm';
import { ReviewItem } from '../../components/productDetails/reviewItem/ReviewItem';
import { getBreadcrumbs } from '../../helpers/getBreadcrumbs';
import commonStyles from '../../styles/common.module.scss';
import styles from '../../styles/pages/Product.module.scss';

export interface ProductProps {
    product?: TProduct | null;
    attributes?: TAttribute[];
    breadcrumbs?: TProductCategory[];
}

const Product: TCromwellPage<ProductProps> = (props) => {
    const client = getGraphQLClient();
    const { product } = props ?? {};
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
                {product?.id && (
                    <CContainer id="product_reviewsBlock" className={styles.reviewsBlock}>
                        <h3 className={styles.reviewsBlockTitle}>Customer reviews</h3>
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
                                loader={async (params) => {
                                    return client.getFilteredProductReviews({
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
                    </CContainer>
                )}
            </div>
        </Layout>
    );
}

export default Product;

export const getStaticProps: TGetStaticProps = async (context): Promise<ProductProps> => {
    const slug = context?.params?.slug ?? null;
    const client = getGraphQLClient();

    let product: TProduct | undefined = undefined;
    if (slug && typeof slug === 'string') {
        try {
            product = await client.getProductBySlug(slug, gql`
                ${client.ProductFragment}
                fragment ProductListFragment on Product {
                    ...ProductFragment
                    categories(pagedParams: {
                      pageSize: 99
                    }) {
                      id
                      name
                      parent {
                          id
                      }
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

    if (product?.categories) delete product.categories;

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
