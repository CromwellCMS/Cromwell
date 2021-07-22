import { gql } from '@apollo/client';
import { TProduct, TProductCategory } from '@cromwell/core';
import { getGraphQLClient, getGraphQLErrorInfo } from '@cromwell/core-frontend';

export const getBreadcrumbs = async (product?: TProduct | null):
    Promise<TProductCategory[] | undefined> => {
    if (!product?.categories?.length) return;
    const client = getGraphQLClient();

    try {
        const parentCategories = await client.query({
            query: gql`
                fragment PCategory on ProductCategory {
                    name
                    slug
                    id
                }
                query Query($id: String!) {
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
                id: product.categories[0].id,
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
        console.error(error, getGraphQLErrorInfo(error));
    }
}