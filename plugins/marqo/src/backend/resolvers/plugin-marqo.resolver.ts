import { TPagedList, TProduct } from '@cromwell/core';
import { FilteredProduct, PagedParamsInput, Product } from '@cromwell/core-backend';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { Arg, Query, Resolver } from 'type-graphql';

import { marqoClient } from '../marqo-client';

@Resolver(Product)
export default class PluginMarqoResolver {
  @Query(() => FilteredProduct)
  @Query(() => String)
  async marqoSearch(
    @Arg('query', () => String) query: string,
    @Arg('pagedParams', () => PagedParamsInput, { nullable: true }) pagedParams?: PagedParamsInput<TProduct>,
  ): Promise<TPagedList<TProduct>> {
    let pageSize = pagedParams?.pageSize;
    if (!pageSize || (pageSize && pageSize > 20)) {
      pageSize = 20;
    }

    const searchRes = await marqoClient.searchProducts({
      query,
      limit: pageSize,
      offset: ((pagedParams?.pageNumber || 1) - 1) * pageSize || undefined,
    });

    if (!searchRes?.length) {
      return {
        elements: [],
        pagedMeta: {
          pageSize,
          pageNumber: pagedParams?.pageNumber || 1,
        },
      };
    }

    const products = await getGraphQLClient().getProducts({
      pagedParams: {
        pageSize,
      },
      filterParams: {
        filters: [{ key: 'id', in: searchRes.map((p) => p.id) }],
      },
    });

    products.elements =
      products.elements?.map((product) => {
        product.meta = { ...(product.meta ?? {}) };
        if (!product.meta.keywords) product.meta.keywords = [];

        const score = searchRes.find((p) => p.id === product.id)?.score;
        (product as any).marqoScore = score;

        if (score) product.meta.keywords.push(`marqo_score:${score}`);
        return product;
      }) || [];

    products.elements.sort((a: any, b: any) => {
      const scoreA = a.marqoScore;
      const scoreB = b.marqoScore;
      if (scoreA && scoreB) {
        return scoreB - scoreA;
      }
      return 0;
    });

    if (products.pagedMeta) {
      products.pagedMeta.pageNumber = pagedParams?.pageNumber || 1;
      products.pagedMeta.pageSize = pageSize;

      delete products.pagedMeta.totalElements;
      delete products.pagedMeta.totalPages;
    }

    return products;
  }
}
