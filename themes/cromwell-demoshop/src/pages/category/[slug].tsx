import React from 'react';
import { TCromwellPage, TProductCategory, TGetStaticProps, TProduct } from '@cromwell/core';
import { Link } from '@cromwell/core-frontend';
import { CContainer, getGraphQLClient, CList } from '@cromwell/core-frontend';
import Layout from '../../components/layout/Layout';
import { Product } from '../../components/product/Product';
//@ts-ignore
import commonStyles from '../../styles/common.module.scss';
//@ts-ignore
import styles from '../../styles/pages/Category.module.scss';
import { gql } from '@apollo/client';

interface ProductProps {
    data?: TProductCategory;
    slug: string;
}
const ProductCategory: TCromwellPage<ProductProps> = (props) => {
    console.log('ProductThemePage props', props);
    const category = props.data;
    const client = getGraphQLClient();

    return (
        <Layout>
            <div className={commonStyles.content}>
                <div className={styles.content}>
                    <div className={styles.sidebar}>
                        <h3>Filters..</h3>
                    </div>
                    <div className={styles.main}>
                        <div className={styles.productList}>
                            <CList<TProduct>
                                ListItem={(props) => <Product data={props.data} className={styles.product} key={props.data?.id} />}
                                usePagination
                                firstBatch={category?.products}
                                useQueryPagination
                                loader={async (pageNumber: number) => {
                                    if (props.slug) {
                                        const cat = await client.getProductCategoryBySlug(props.slug,
                                            { pageSize: 20, pageNumber });
                                        if (cat) return cat.products;
                                    }
                                }}
                                cssClasses={{
                                    page: styles.productList
                                }}
                            />
                        </div>
                    </div>
                </div>

            </div>
        </Layout>
    );
}

export const getStaticProps: TGetStaticProps = async (context) => {
    // console.log('context', context)
    const slug = (context && context.params) ? context.params.slug : null;
    console.log('CategoryThemePage::getStaticProps: slug', slug, 'context.params', context.params)
    let data: TProductCategory | null = null;
    if (slug && typeof slug === 'string') {
        try {
            data = await getGraphQLClient().
                getProductCategoryBySlug(slug, { pageSize: 20 });
        } catch (e) {
            console.error('Product::getStaticProps', e)
        }
    } else {
        console.error('Product::getStaticProps: !pid')
    }

    return {
        slug,
        data
    }

}

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: true
    };
}

export default ProductCategory;
