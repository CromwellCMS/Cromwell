import { gql } from '@apollo/client';
import {
    getBlockInstance, TAttribute, TGetStaticProps, TPagedParams,
    TProduct, TProductCategory, TFilteredProductList, TProductFilterMeta, TProductFilter
} from '@cromwell/core';
import { getGraphQLClient, TCGraphQLClient, TCList } from '@cromwell/core-frontend';

import { } from '../types';

export type TProductFilterData = {
    productCategory?: TProductCategory;
    slug?: string | string[] | null;
    attributes?: TAttribute[];
    filterMeta?: TProductFilterMeta;
}

const getFiltered = async (client: TCGraphQLClient | undefined, categoryId: string, pagedParams: TPagedParams<TProduct>,
    filterParams: TProductFilter, cb?: (data: TFilteredProductList | undefined) => void): Promise<TFilteredProductList | undefined> => {
    // console.log('getFiltered', filterParams);
    let data;
    try {
        data = await client?.query({
            query: gql`
            query getFilteredProducts($categoryId: String!, $pagedParams: PagedParamsInput!, $filterParams: ProductFilterInput!) {
                getFilteredProducts(categoryId: $categoryId, pagedParams: $pagedParams, filterParams: $filterParams) {
                    pagedMeta {
                        ...PagedMetaFragment
                    }
                    filterMeta {
                        minPrice
                        maxPrice
                    }
                    elements {
                        ...ProductFragment
                    }
                }
            }
            ${client?.ProductFragment}
            ${client?.PagedMetaFragment}
        `,
            variables: {
                pagedParams,
                filterParams,
                categoryId
            }
        });
    } catch (e) {
        console.error('ProductFilter::getFiltered error: ', e.message)
    }

    const filteredList: TFilteredProductList | undefined = data?.data?.getFilteredProducts;
    if (cb) cb(filteredList);
    return filteredList;
}

export const filterCList = (filterOptions: TProductFilter, productListId: string,
    productCategoryId: string, client: TCGraphQLClient | undefined, cb: (data: TFilteredProductList | undefined) => void) => {
    // console.log('filterCList', checkedAttrs, priceRange);

    const list = getBlockInstance<TCList>(productListId)?.getContentInstance();
    if (list) {
        const listProps = Object.assign({}, list.getProps());
        listProps.loader = async (pagedParams: TPagedParams<TProduct>): Promise<TFilteredProductList | undefined> => {
            // const timestamp = Date.now();
            const filtered = await getFiltered(client, productCategoryId, pagedParams, filterOptions, cb);
            // const timestamp2 = Date.now();
            // console.log('ProductFilterResolver::getFilteredProducts time elapsed: ' + (timestamp2 - timestamp) + 'ms');
            return filtered;
        };
        listProps.firstBatch = undefined;
        list.setProps(listProps);
        list.clearState();
        list.init();
    }
}

export const getStaticProps: TGetStaticProps = async (context): Promise<TProductFilterData> => {
    // console.log('context', context)
    const slug = (context && context.params) ? context.params.slug : null;

    const client = getGraphQLClient();

    let productCategory: TProductCategory | undefined = undefined;
    if (slug && typeof slug === 'string') {
        try {
            productCategory = await client?.getProductCategoryBySlug(slug);
        } catch (e) {
            console.error('ProductFilter::getStaticProps', e.message)
        }
    } else {
        console.error('ProductFilter::getStaticProps: !pid')
    }

    let attributes: TAttribute[] | undefined;

    try {
        attributes = await client?.getAttributes();
    } catch (e) {
        console.error('ProductFilter::getStaticProps getAttributes', e.message)
    }

    let filterMeta: TProductFilterMeta | undefined;

    if (productCategory && productCategory.id) {
        filterMeta = (await getFiltered(client, productCategory.id, { pageSize: 1 }, {}))?.filterMeta;
    }

    return {
        slug,
        productCategory,
        attributes,
        filterMeta
    }
}