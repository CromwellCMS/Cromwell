import { gql } from '@apollo/client';
import { TProductCategory } from '@cromwell/core';
import { getGraphQLClient, getGraphQLErrorInfo } from '@cromwell/core-frontend';

export const getData = async (productId?: number | null):
    Promise<TProductCategory[] | undefined> => {
    if (!productId) return;
    const client = getGraphQLClient();

    const product = await client.getProductById(productId, gql`
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
        }
    `, 'ProductListFragment');

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

        return breadCrumbs.reverse();
    } catch (error) {
        console.error(getGraphQLErrorInfo(error));
    }
}