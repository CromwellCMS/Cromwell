import React from 'react';
import { TCromwellPage, TProductCategory, TGetStaticProps, TProduct, TPagedList } from '@cromwell/core';
import { Pagination as MUIPagination } from '@material-ui/lab';
import { Link } from '@cromwell/core-frontend';
import { CContainer, getGraphQLClient, CList } from '@cromwell/core-frontend';
import Layout from '../../components/layout/Layout';
import { Product } from '../../components/product/Product';
import { CategorySort } from '../../components/categorySort/CategorySort';
//@ts-ignore
import commonStyles from '../../styles/common.module.scss';
//@ts-ignore
import styles from '../../styles/pages/Category.module.scss';
//@ts-ignore
import layoutStyles from '../../components/layout/Layout.module.scss';
import { gql } from '@apollo/client';

interface ProductProps {
    category?: TProductCategory | null;
    products?: TPagedList<TProduct> | null;
    slug?: string;
}

const Pagination = (props: {
    count: number;
    page: number;
    onChange: (page: number) => void;
}) => {
    return (
        <MUIPagination count={props.count} page={props.page}
            onChange={(event: React.ChangeEvent<unknown>, value: number) => {
                props.onChange(value)
            }}
            className={styles.pagination}
            showFirstButton showLastButton
        />
    )
}

const ProductCategory: TCromwellPage<ProductProps> = (props) => {
    // console.log('ProductThemePage props', props);
    const category = props.category;
    const client = getGraphQLClient();
    const listId = 'Category_ProductList';
    return (
        <Layout>
            <div className={commonStyles.content}>
                <div className={styles.content}>
                    <div className={styles.sidebar}>
                        <CContainer id="Category_ProductFilter" />
                    </div>
                    <div className={styles.main}>
                        <div>
                            <CategorySort listId={listId} />
                        </div>
                        {category && (
                            <CList<TProduct>
                                id={listId}
                                ListItem={(props) => <Product data={props.data} className={styles.product} key={props.data?.id} />}
                                usePagination
                                useShowMoreButton
                                useQueryPagination
                                disableCaching
                                pageSize={20}
                                maxDomPages={2}
                                scrollContainerSelector={`.${layoutStyles.Layout}`}
                                firstBatch={props.products ? props.products : undefined}
                                loader={async (params) => {
                                    return client?.getProductsFromCategory(category.id, params)
                                }}
                                cssClasses={{
                                    page: styles.productList
                                }}
                                elements={{
                                    pagination: Pagination
                                }}
                            />
                        )}
                    </div>
                </div>

            </div>
        </Layout>
    );
}

export const getStaticProps: TGetStaticProps = async (context): Promise<ProductProps> => {
    // console.log('context', context)
    const slug = (context && context.params) ? context.params.slug : null;
    console.log('CategoryThemePage::getStaticProps: slug', slug, 'context.params', context.params)
    let category: TProductCategory | undefined | null = null;
    if (slug && typeof slug === 'string') {
        try {
            category = await getGraphQLClient()?.
                getProductCategoryBySlug(slug);
        } catch (e) {
            console.error('Product::getStaticProps', e)
        }
    } else {
        console.error('Product::getStaticProps: !pid')
    }
    let products: TPagedList<TProduct> | undefined | null = null;
    if (category) {
        try {
            products = await getGraphQLClient()?.getProductsFromCategory(category.id,
                { pageSize: 20 })
        } catch (e) {
            console.error('Product::getStaticProps', e)
        }
    }

    return {
        slug: slug as string,
        category: category ? category : null,
        products: products ? products : null
    }

}

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: true
    };
}

export default ProductCategory;
