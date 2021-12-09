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
import { TCGraphQLClient, TCList, getGraphQLClient, getGraphQLErrorInfo } from '@cromwell/core-frontend';

import { TProductFilterSettings } from '../types';

export type TInitialData = {
    attributes?: TAttribute[];
    filterMeta?: TProductFilterMeta;
    productCategory?: TProductCategory;
}

export type TProductFilterData = {
    slug?: string | string[] | null;
    pluginSettings?: TProductFilterSettings;
}

export const getInitialData = async (slug?: string): Promise<TInitialData> => {
    const client = getGraphQLClient();
    // const timestamp = Date.now();

    const getCategory = async () => {
        if (!slug) return;
        try {
            return await client?.getProductCategoryBySlug(
                slug as string,
                gql`
                    fragment PCategory on ProductCategory {
                        id
                        slug
                        name
                        mainImage
                        parent {
                            name
                            slug
                            id
                        }
                        children {
                          name
                          slug
                          id
                        }
                    }
                `,
                'PCategory'
            )
        } catch (error) {
            console.error('ProductFilter::getStaticProps', error);
            console.error(JSON.stringify(getGraphQLErrorInfo(error), null, 2));
        }
    }
    const productCategory = await getCategory();

    let attributes: TAttribute[] | undefined;
    try {
        attributes = await client?.getAttributes();
    } catch (e: any) {
        console.error('ProductFilter::getStaticProps getAttributes', e.message)
    }

    let filterMeta: TProductFilterMeta | undefined;

    if (productCategory && productCategory.id) {
        filterMeta = (await getFiltered(client, productCategory.id, { pageSize: 1 }, {}))?.filterMeta;
    }

    // const timestamp2 = Date.now();
    // console.log('ProductFilter::getStaticProps time elapsed: ' + (timestamp2 - timestamp) + 'ms');
    return {
        productCategory,
        attributes,
        filterMeta,
    }
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

export const getFiltered = async (client: TCGraphQLClient | undefined, categoryId: number, pagedParams: TPagedParams<TProduct>,
    filterParams: TProductFilter, cb?: (data: TFilteredProductList | undefined) => void): Promise<TFilteredProductList | undefined> => {

    filterParams.categoryId = categoryId;

    const getProducts = async () => {
        try {
            return await client?.query({
                query: gql`
                query getFilteredProducts($pagedParams: PagedParamsInput!, $filterParams: ProductFilterInput!) {
                    getFilteredProducts(pagedParams: $pagedParams, filterParams: $filterParams) {
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
