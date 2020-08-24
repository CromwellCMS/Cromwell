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
    filterParams: TProductFilter, cb?: (data: TFilteredList<TProduct> | undefined) => void, withCategories = false): Promise<TFilteredList<TProduct> | undefined> => {
    // console.log('getFiltered', filterParams);
    const data = await client?.query({
        query: gql`
            query getFilteredProductsFromCategory($categoryId: String!, $pagedParams: PagedParamsInput!, $filterParams: ProductFilterInput!, $withCategories: Boolean!) {
                getFilteredProductsFromCategory(categoryId: $categoryId, pagedParams: $pagedParams, filterParams: $filterParams) {
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
            withCategories,
            filterParams,
            categoryId
        }
    });
    const filteredList: TFilteredList<TProduct> | undefined = data?.data?.getFilteredProductsFromCategory;
    if (cb) cb(filteredList);
    return filteredList;
}

export const filterCList = (checkedAttrs: Record<string, string[]>, priceRange: number[], productListId: string,
    productCategoryId: string, client: TCGraphQLClient | undefined, cb: (data: TFilteredList<TProduct> | undefined) => void) => {
    // console.log('filterCList', checkedAttrs, priceRange);
    const list: TCList | undefined = getBlockInstance(productListId)?.getContentInstance() as any;
    if (list) {
        const listProps = Object.assign({}, list.getProps());
        listProps.loader = (pagedParams: TPagedParams<TProduct>): Promise<TFilteredList<TProduct> | undefined> => {
            const filterOptions: TProductFilter = {
                attributes: Object.keys(checkedAttrs).map(key => ({
                    key, values: checkedAttrs[key]
                })),
                minPrice: priceRange[0],
                maxPrice: priceRange[1]
            }
            return getFiltered(client, productCategoryId, pagedParams, filterOptions, cb);
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
    console.log('CategoryThemePage::getStaticProps: slug', slug, 'context.params', context.params)

    const client = getGraphQLClient();

    let productCategory: TProductCategory | undefined = undefined;
    if (slug && typeof slug === 'string') {
        try {
            productCategory = await client?.getProductCategoryBySlug(slug, { pageSize: 20 });
        } catch (e) {
            console.error('Product::getStaticProps', e)
        }
    } else {
        console.error('Product::getStaticProps: !pid')
    }

    let attributes: TAttribute[] | undefined;

    try {
        attributes = await client?.getAttributes();
    } catch (e) {
        console.error('Product::getStaticProps', e)
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