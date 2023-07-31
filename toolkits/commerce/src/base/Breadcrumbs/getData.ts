import { DocumentNode, gql } from '@apollo/client';
import { TProductCategory } from '@cromwell/core';
import { getGraphQLClient, TGraphQLErrorInfo } from '@cromwell/core-frontend';

import { BreadcrumbsData } from './Breadcrumbs';

/** @internal */
export type BreadcrumbsGetDataOptions = {
  productId?: number | null;
  productSlug?: string | null;
  categoryFragment?: DocumentNode;
  categoryFragmentName?: string;
  maxLevel?: number;
};

/**
 * Fetches data for `Breadcrumbs` component.
 * @param options configuring object. You must specify `productId` OR `productSlug` for method to work.
 * @internal
 */
export const breadcrumbsGetData = async (options: BreadcrumbsGetDataOptions): Promise<BreadcrumbsData> => {
  const { productId, productSlug, maxLevel } = options;
  let { categoryFragment, categoryFragmentName } = options;
  const client = getGraphQLClient();
  if (!productId && !productSlug) return;

  const productFragment = gql`
    fragment ProductListFragment on Product {
      id
      slug
      mainCategoryId
    }
  `;

  const getter = productId
    ? () => client.getProductById(productId, productFragment, 'ProductListFragment')
    : productSlug
    ? () => client.getProductBySlug(productSlug, productFragment, 'ProductListFragment')
    : undefined;

  const productShort =
    (await getter?.().catch((error: TGraphQLErrorInfo) => {
      if (error.statusCode !== 404) console.error('breadcrumbsGetData:', error);
    })) || undefined;

  if (!productShort) return;

  // We'll fetch breadcrumbs starting from target category
  let targetCategoryId: number | undefined | null;

  if (productShort?.mainCategoryId) {
    // if `mainCategoryId` is set, use it as target
    targetCategoryId = productShort.mainCategoryId;
  } else {
    // Otherwise fetch all categories of a product and use most nested category as target
    const productWithCategoriesFragment = gql`
      fragment ProductWithCategoriesFragment on Product {
        mainCategoryId
        categories {
          id
          name
          nestedLevel
        }
      }
    `;

    const productWithCategories =
      (await (productId
        ? client.getProductById(productId, productWithCategoriesFragment, 'ProductWithCategoriesFragment')
        : productSlug &&
          client.getProductBySlug(productSlug, productWithCategoriesFragment, 'ProductWithCategoriesFragment'))) ||
      undefined;

    let mostNestedLevel = 0;
    let mostNested = productWithCategories?.categories?.[0];

    for (const category of productWithCategories?.categories ?? []) {
      if (category.nestedLevel && category.nestedLevel > mostNestedLevel) {
        mostNested = category;
        mostNestedLevel = category.nestedLevel;
      }
    }

    targetCategoryId = mostNested?.id;
  }

  if (!targetCategoryId) return;

  if (!categoryFragmentName) categoryFragmentName = 'PCategory';
  if (!categoryFragment)
    categoryFragment = gql`
      fragment PCategory on ProductCategory {
        name
        slug
        id
      }
    `;

  let nestedGraph = `
    parent {
        ...${categoryFragmentName}
    }`;

  // Fetch parents of target category. 8 max by default
  for (let i = 0; i < (maxLevel || 8); i++) {
    nestedGraph = `
        parent {
            ...${categoryFragmentName}
            ${nestedGraph}
        }`;
  }

  try {
    const parentCategories = await client.query(
      {
        query: gql`
                ${categoryFragment}
                query Query($id: Int!) {
                  getProductCategoryById(id: $id) {
                    ...${categoryFragmentName}
                    ${nestedGraph}
                  }
                }
            `,
        variables: {
          id: targetCategoryId,
        },
      },
      'getProductCategoryById',
    );

    const breadCrumbs: TProductCategory[] = [];
    const getBreadCrumb = (cat: TProductCategory) => {
      breadCrumbs.push(cat);
      if (cat.parent) {
        getBreadCrumb(cat.parent);
      }
    };
    if (parentCategories) getBreadCrumb(parentCategories);

    return {
      categories: breadCrumbs.reverse(),
    };
  } catch (error) {
    console.error(error);
  }
};
