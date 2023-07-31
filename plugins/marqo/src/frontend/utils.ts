import { gql } from '@apollo/client';
import { isServer, TPagedList, TProduct } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { pluginName } from '../constants';

type QueryMarqoArgs = {
  query: string;
  page: number;
};

type QueryMarqoResult = TPagedList<TProduct> | undefined;

export async function queryMarqo({ query, page }: QueryMarqoArgs): Promise<QueryMarqoResult> {
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

const store: {
  queryCache: Record<string, TPagedList<TProduct>>;
} = {} as any;

const queryCacheKey = `${pluginName}_queryCache`;

export async function queryMarqoWithSessionCache(args: QueryMarqoArgs): Promise<QueryMarqoResult> {
  if (!store.queryCache) {
    if (!isServer()) {
      try {
        const cache = window.sessionStorage.getItem(queryCacheKey);
        if (cache) {
          const data = JSON.parse(cache);
          if (typeof data === 'object') {
            store.queryCache = data;
          }
        }
      } catch (error) {
        //
      }
    }
    if (!store.queryCache) store.queryCache = {};
  }

  const resultCacheKey = `q:${args.query}_p:${args.page || 1}`;
  if (store.queryCache[resultCacheKey]) {
    return store.queryCache[resultCacheKey];
  }

  const result = await queryMarqo(args);

  if (result) {
    store.queryCache[resultCacheKey] = result;
    if (!isServer()) {
      setTimeout(() => {
        try {
          window.sessionStorage.setItem(queryCacheKey, JSON.stringify(store.queryCache));
        } catch (error) {
          //
        }
      });
    }
  }

  return result;
}
