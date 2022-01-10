import { DocumentNode, gql } from '@apollo/client';
import { TProductCategory } from '@cromwell/core';
import { getGraphQLClient, getGraphQLErrorInfo } from '@cromwell/core-frontend';

import { ServerSideData } from './Breadcrumbs';

export const getData = async ({ productId, productSlug, productFragment, productFragmentName }: {
    productId?: number | null;
    productSlug?: string | null;
    productFragment?: DocumentNode;
    productFragmentName?: string;
}):
    Promise<ServerSideData> => {
    const client = getGraphQLClient();
    if (!productId && !productSlug) return;

    if (!productFragment) productFragment = gql`
    ${client.ProductFragment}
    fragment ProductListFragment on Product {
        ...ProductFragment
        categories(pagedParams: {
          pageSize: 30
        }) {
          id
          name
          parent {
              id
          }
        }
    }`;
    if (!productFragmentName) productFragmentName = 'ProductListFragment';

    const product = await (productId ? client.getProductById(productId, productFragment, productFragmentName) :
        productSlug && client.getProductBySlug(productSlug, productFragment, productFragmentName)) || undefined;

    if (!product?.categories?.length) return;
    const categories = product.categories;
    let targetCategoryId: number | undefined | null = product?.mainCategoryId;

    if (!targetCategoryId) {
        const getNestedLevel = (category: TProductCategory, level = 0) => {
            if (!category.parent?.id) return level;
            for (const cat of categories) {
                if (cat.id === category.parent.id) {
                    level++;
                    return getNestedLevel(cat, level);
                }
            }
            return level;
        }

        let mostNestedLevel = 0;
        let mostNested = product.categories[0];

        product.categories.forEach(cat => {
            if (cat.parent?.id) {
                const level = getNestedLevel(cat);
                if (level > mostNestedLevel) {
                    mostNestedLevel = level;
                    mostNested = cat;
                }
            }
        });
        targetCategoryId = mostNested?.id;
    }

    try {
        const parentCategories = await client.query({
            query: gql`
                fragment PCategory on ProductCategory {
                    name
                    slug
                    id
                }
                query Query($id: Int!) {
                  getProductCategoryById(id: $id) {
                    ...PCategory
                    parent {
                      ...PCategory
                      parent {
                        ...PCategory
                        parent {
                          ...PCategory
                        }
                      }
                    }
                  }
                }
            `,
            variables: {
                id: targetCategoryId,
            },
        }, 'getProductCategoryById');

        const breadCrumbs: TProductCategory[] = [];
        const getBreadCrumb = (cat: TProductCategory) => {
            breadCrumbs.push(cat);
            if (cat.parent) {
                getBreadCrumb(cat.parent);
            }
        }
        if (parentCategories)
            getBreadCrumb(parentCategories);

        return {
            categories: breadCrumbs.reverse(),
        }
    } catch (error) {
        console.error(getGraphQLErrorInfo(error));
    }
}