import {
    TAttribute,
    TCromwellBlock,
    TCromwellPage,
    TGetStaticProps,
    TPagedList,
    TProduct,
    TProductCategory,
} from '@cromwell/core';
import { CContainer, CList, getGraphQLClient, TCList } from '@cromwell/core-frontend';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import React, { useEffect, useRef } from 'react';

import { CategorySort } from '../../components/categorySort/CategorySort';
import Layout from '../../components/layout/Layout';
import layoutStyles from '../../components/layout/Layout.module.scss';
import { Pagination } from '../../components/pagination/Pagination';
import { ProductCard } from '../../components/productCard/ProductCard';
import commonStyles from '../../styles/common.module.scss';
import styles from '../../styles/pages/Category.module.scss';

interface CategoryProps {
    category?: TProductCategory | null;
    products?: TPagedList<TProduct> | null;
    attributes?: TAttribute[];
    slug?: string;
}


const ProductCategory: TCromwellPage<CategoryProps> = (props) => {
    const category = props.category;
    const client = getGraphQLClient();
    const listId = 'Category_ProductList';
    const router = useRouter?.();
    const listInst = useRef<TCromwellBlock<TCList> | undefined>();

    useEffect(() => {
        const list: TCList | undefined = listInst.current?.getContentInstance();
        if (list) {
            list.updateData();
        }
    }, [router?.asPath]);

    return (
        <Layout>
            <CContainer id="category_1" className={clsx(commonStyles.content, styles.content)}>
                <CContainer id="category_3" className={styles.sidebar}>
                    <CContainer id="Category_ProductFilter" />
                </CContainer>
                <CContainer id="category_2" className={styles.main}>
                    <CContainer id="category_4" className={styles.header}>
                        <h1 className={styles.title}>{category?.name ?? ''}</h1>
                        <div className={styles.sort}>
                            <CategorySort listId={listId} />
                        </div>
                    </CContainer>
                    {category && props.attributes && (
                        <CList<TProduct>
                            id={listId}
                            blockRef={(block) => listInst.current = block}
                            ListItem={(p) => {
                                return (
                                    <div className={styles.productWrapper}>
                                        <ProductCard
                                            data={p.data}
                                            className={styles.product}
                                            key={p.data?.id}
                                            attributes={props.attributes}
                                        />
                                    </div>
                                )
                            }}
                            usePagination
                            useShowMoreButton
                            useQueryPagination
                            disableCaching
                            pageSize={20}
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
                    {category?.description && (
                        <div
                            className={styles.description}
                            dangerouslySetInnerHTML={{ __html: category.description }}
                        ></div>
                    )}
                </CContainer>
            </CContainer>
        </Layout>
    );
}

export const getStaticProps: TGetStaticProps = async (context): Promise<CategoryProps> => {
    const slug = context?.params?.slug;
    const client = getGraphQLClient();

    let category: TProductCategory | undefined | null = null;
    if (slug && typeof slug === 'string') {
        try {
            category = await client?.getProductCategoryBySlug(slug);
        } catch (e) {
            console.error('ProductCategory::getStaticProps 1, slug: ' + slug, e)
        }
    } else {
        console.error('ProductCategory::getStaticProps: !pid')
    }
    let products: TPagedList<TProduct> | undefined | null = null;
    if (category) {
        try {
            products = await client?.getProductsFromCategory(category.id,
                { pageSize: 20 })
        } catch (e) {
            console.error('ProductCategory::getStaticProps 2, slug: ' + slug, e)
        }
    }

    let attributes: TAttribute[] | undefined;

    try {
        attributes = await client?.getAttributes();
    } catch (e) {
        console.error('Product::getStaticProps', e)
    }

    return {
        slug: slug as string,
        category: category ? category : null,
        products: products ? products : null,
        attributes
    }

}

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: true
    };
}

export default ProductCategory;
