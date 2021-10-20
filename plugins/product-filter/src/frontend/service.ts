import { gql } from '@apollo/client';
import {
    getBlockInstance,
    TAttribute,
    TFilteredProductList,
    TPagedParams,
    TProduct,
    TProductCategory,
    TProductFilter,
    TProductFilterMeta,
} from '@cromwell/core';
import { TCGraphQLClient, TCList } from '@cromwell/core-frontend';

import { TProductFilterSettings } from '../types';

export type TProductFilterData = {
    productCategory?: TProductCategory;
    slug?: string | string[] | null;
    attributes?: TAttribute[];
    filterMeta?: TProductFilterMeta;
    pluginSettings?: TProductFilterSettings;
}

export const setListProps = (productListId?: string,
    productCategory?: TProductCategory,
    client?: TCGraphQLClient | undefined,
    filterOptions?: TProductFilter,
    cb?: (data: TFilteredProductList | undefined) => any
) => {
    if (!productListId || !productCategory || !filterOptions) return;
    const list = getBlockInstance<TCList>(productListId)?.getContentInstance();
    if (!list) return;

    const listProps = Object.assign({}, list.getProps());
    listProps.loader = async (pagedParams: TPagedParams<TProduct>): Promise<TFilteredProductList | undefined> => {
        // const timestamp = Date.now();
        const filtered = await getFiltered(client, productCategory?.id, pagedParams, filterOptions, cb);
        // const timestamp2 = Date.now();
        // console.log('ProductFilterResolver::getFilteredProducts time elapsed: ' + (timestamp2 - timestamp) + 'ms');
        return filtered;
    };
    listProps.firstBatch = undefined;
    list.setProps(listProps);
}

export const getFiltered = async (client: TCGraphQLClient | undefined, categoryId: string, pagedParams: TPagedParams<TProduct>,
    filterParams: TProductFilter, cb?: (data: TFilteredProductList | undefined) => void): Promise<TFilteredProductList | undefined> => {

    const getProducts = async () => {
        try {
            return await client?.query({
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
        } catch (e: any) {
            console.error('ProductFilter::getFiltered error: ', e.message)
        }
    }
    const data = await getProducts();

    const filteredList: TFilteredProductList | undefined = data?.data?.getFilteredProducts;
    if (cb) cb(filteredList);
    return filteredList;
}

export const filterCList = (filterOptions: TProductFilter,
    productListId: string,
    productCategory: TProductCategory,
    client: TCGraphQLClient | undefined,
    cb: (data: TFilteredProductList | undefined) => void
) => {
    const list = getBlockInstance<TCList>(productListId)?.getContentInstance();
    if (list) {
        setListProps(productListId, productCategory, client, filterOptions, cb);
        list.clearState();
        list.init();
    }
}
