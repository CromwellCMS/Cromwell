import { gql } from '@apollo/client';
import {
  TAttribute,
  TFilteredProductList,
  TPagedParams,
  TProduct,
  TProductCategory,
  TProductFilter,
} from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';

export async function getCategoryBySlug(slug?: string): Promise<TProductCategory | undefined> {
  if (!slug) return;
  const client = getGraphQLClient();

  try {
    return await client.getProductCategoryBySlug(
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
      'PCategory',
    );
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
  }
}

export async function getFilteredProducts({
  pagedParams,
  filterParams = {},
  categoryId,
}: {
  pagedParams: TPagedParams<TProduct>;
  filterParams?: TProductFilter;
  categoryId: number | undefined;
}): Promise<TFilteredProductList | undefined> {
  const client = getGraphQLClient();
  if (categoryId) filterParams.categoryId = categoryId;

  try {
    const result = await client?.query({
      query: gql`
        query getProducts($pagedParams: PagedParamsInput!, $filterParams: ProductFilterInput) {
          getProducts(pagedParams: $pagedParams, filterParams: $filterParams) {
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
      },
    });

    const filteredList: TFilteredProductList | undefined = result?.data?.getProducts;

    return filteredList;
  } catch (e: any) {
    console.error('ProductFilter::getFiltered error: ', e.message);
  }
}

export async function getAttributes(): Promise<TAttribute[] | undefined> {
  const client = getGraphQLClient();

  const attributes: TAttribute[] | undefined =
    (await client
      .getAttributes({ pagedParams: { pageSize: 100 } })
      .catch((e) => console.error('ProductFilter::getStaticProps error: ', e))
      .then((data) => data && data.elements)) || undefined;

  return attributes;
}
