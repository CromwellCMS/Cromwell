import { gql } from '@apollo/client';
import { TPagedList, TProduct } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';

export async function queryMarqo({
  query,
  page,
}: {
  query: string;
  page: number;
}): Promise<TPagedList<TProduct> | undefined> {
  const result = await getGraphQLClient()
    .query({
      query: gql`
        query MarqoSearch($query: String!, $pagedParams: PagedParamsInput) {
          marqoSearch(query: $query, pagedParams: $pagedParams) {
            elements {
              id
              slug
              name
              price
              oldPrice
              mainImage
              rating {
                average
                reviewsNumber
              }
              meta {
                keywords
              }
            }
            pagedMeta {
              pageNumber
              pageSize
            }
          }
        }
      `,
      variables: {
        query: query,
        pagedParams: {
          pageSize: 20,
          pageNumber: page,
        },
      },
    })
    .catch(console.error);

  return result?.data?.marqoSearch;
}
