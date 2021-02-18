import { gql } from '@apollo/client';
import {
    getBlockInstance, TAttribute, TGetStaticProps, TPagedParams,
    TProduct, TProductCategory
} from '@cromwell/core';
import { getGraphQLClient, TCGraphQLClient, TCList } from '@cromwell/core-frontend';

import { TFilteredList, TFilterMeta, TProductFilter } from '../types';

export type TProductFilterData = {
    productCategory?: TProductCategory;
    slug?: string | string[] | null;
    attributes?: TAttribute[];
    filterMeta?: TFilterMeta;
}

const getFiltered = async (client: TCGraphQLClient | undefined, categoryId: string, pagedParams: TPagedParams<TProduct>,
    filterParams: TProductFilter, cb?: (data: TFilteredList<TProduct> | undefined) => void): Promise<TFilteredList<TProduct> | undefined> => {
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

    const filteredList: TFilteredList<TProduct> | undefined = data?.data?.getFilteredProducts;
    if (cb) cb(filteredList);
    return filteredList;
}

export const filterCList = (checkedAttrs: Record<string, string[]>, priceRange: number[], productListId: string,
    productCategoryId: string, client: TCGraphQLClient | undefined, cb: (data: TFilteredList<TProduct> | undefined) => void) => {
    // console.log('filterCList', checkedAttrs, priceRange);
    const list: TCList | undefined = getBlockInstance(productListId)?.getContentInstance() as any;
    if (list) {
        const listProps = Object.assign({}, list.getProps());
        listProps.loader = async (pagedParams: TPagedParams<TProduct>): Promise<TFilteredList<TProduct> | undefined> => {
            const filterOptions: TProductFilter = {
                attributes: Object.keys(checkedAttrs).map(key => ({
                    key, values: checkedAttrs[key]
                })),
                minPrice: priceRange[0],
                maxPrice: priceRange[1]
            }
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

    let filterMeta: TFilterMeta | undefined;

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