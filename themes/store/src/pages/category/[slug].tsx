import { gql } from '@apollo/client';
import { TAttribute, TCromwellBlock, TGetStaticProps, TPagedList, TProduct, TProductCategory } from '@cromwell/core';
import { CContainer, CList, getGraphQLClient, getGraphQLErrorInfo, TCList } from '@cromwell/core-frontend';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import React, { ReactElement, useEffect, useRef } from 'react';

import { CategorySort } from '../../components/categorySort/CategorySort';
import Layout from '../../components/layout/Layout';
import layoutStyles from '../../components/layout/Layout.module.scss';
import { Pagination } from '../../components/pagination/Pagination';
import { ProductCard } from '../../components/productCard/ProductCard';
import { getHead } from '../../helpers/getHead';
import { removeUndefined } from '../../helpers/removeUndefined';
import commonStyles from '../../styles/common.module.scss';
import styles from '../../styles/pages/Category.module.scss';

import type { TPageWithLayout } from '../_app';

interface CategoryProps {
    category?: TProductCategory | null;
    products?: TPagedList<TProduct> | null;
    attributes?: TAttribute[];
    slug?: string;
    notFound?: boolean;
}


const ProductCategory: TPageWithLayout<CategoryProps> = (props) => {
    const category = props.category;
    const client = getGraphQLClient();
    const listId = 'Category_ProductList';
    const router = useRouter?.();
    const listInst = useRef<TCromwellBlock<TCList> | undefined>();
    const prevPath = useRef<string | undefined>();

    useEffect(() => {
        if (prevPath.current) {
            const list: TCList | undefined = listInst.current?.getContentInstance();
            if (list) {
                list.updateData();
            }
        }
        prevPath.current = router?.asPath;
    }, [router?.asPath]);

    if (category && !category.pageTitle) {
        // Default meta page title
        category.pageTitle = category.name;
    }

    return (
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
                {getHead({
                    documentContext: props.cmsProps?.documentContext,
                    image: category?.mainImage,
                    data: category,
                })}
                <CContainer id="category_11">
                    {category && (
                        <CList<TProduct>
                            editorHidden
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
                            firstBatch={props.products}
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
                </CContainer>
                <CContainer id="category_14">
                    {category?.description && (
                        <div
                            className={styles.description}
                            dangerouslySetInnerHTML={{ __html: category.description }}
                        ></div>
                    )}
                </CContainer>
            </CContainer>
        </CContainer>
    );
}

ProductCategory.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout >
    )
}

export const getStaticProps: TGetStaticProps<CategoryProps> = async (context) => {
    const slug = context?.params?.slug;
    const client = getGraphQLClient();
    // const timestamp = Date.now();

    let category: TProductCategory | undefined | null = null;
    if (slug && typeof slug === 'string') {
        try {
            category = await client?.getProductCategoryBySlug(slug);
        } catch (e) {
            console.error('ProductCategory::getStaticProps 1, slug: ' + slug, getGraphQLErrorInfo(e))
        }
    } else {
        console.error('ProductCategory::getStaticProps: !pid')
    }

    if (!category) {
        return {
            notFound: true,
        }
    }

    let products: TPagedList<TProduct> | undefined | null = null;
    if (category) {
        try {
            products = await client?.getProductsFromCategory(category.id,
                { pageSize: 20 },
                gql`
                fragment ProductShortFragment on Product {
                    id
                    slug
                    isEnabled
                    name
                    price
                    oldPrice
                    sku
                    mainImage
                    rating {
                        average
                        reviewsNumber
                    }
                }`, 'ProductShortFragment')
        } catch (e) {
            console.error('ProductCategory::getStaticProps 2, slug: ' + slug, getGraphQLErrorInfo(e))
        }
    }

    let attributes: TAttribute[] | undefined;

    try {
        attributes = await client?.getAttributes();
    } catch (e) {
        console.error('Product::getStaticProps', getGraphQLErrorInfo(e))
    }

    // const timestamp4 = Date.now();
    // console.log('ProductCategory::getAttributes time elapsed: ' + (timestamp4 - timestamp) + 'ms');

    return {
        props: removeUndefined({
            slug: slug as string,
            category,
            products,
            attributes
        })
    }

}

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: 'blocking',
    };
}

export default ProductCategory;
