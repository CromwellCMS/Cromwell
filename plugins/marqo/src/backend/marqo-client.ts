import { gql } from '@apollo/client';
import { TProduct } from '@cromwell/core';
import { awaitDbConnection, getLogger, getPluginSettings } from '@cromwell/core-backend';
import { fetch, getGraphQLClient } from '@cromwell/core-frontend';
import { throttle } from 'throttle-debounce';

import { SettingsType } from '../types';

const logger = getLogger();

type MarqoProduct = {
  _id: string;
  title?: string;
  description?: string;
  [key: string]: string | undefined;
};

class MarqoClient {
  constructor() {
    this.init().catch((err) => logger.error(err));
  }

  private async init() {
    await awaitDbConnection();
    this.throttledUpdateSettings();
  }

  private settings: SettingsType = {};

  public getSettings(): SettingsType {
    // Settings are usually retrieved from the cache. Below throttled function to update the cache.
    this.throttledUpdateSettings();
    return this.settings;
  }

  private throttledUpdateSettings = throttle(1000, async () => {
    this.updateSettings();
  });

  public async updateSettings() {
    const settings = await getPluginSettings<SettingsType>('@cromwell/plugin-marqo');
    this.settings = settings || {};
  }

  public mapProductMultiField = (product: TProduct): MarqoProduct => ({
    _id: 'product_' + product.id,
    title: product.name || undefined,
    description: product.description || undefined,
    marqo_data: product.customMeta?.marqo_data || undefined,
    ...Object.assign(
      {},
      ...(product.attributes?.map((attr) => ({ [attr.key]: attr.values?.map((val) => val.value)?.join(', ') })) || []),
    ),
  });

  public mapProduct = (product: TProduct): MarqoProduct => {
    let title = `${product.name || ''}`;
    if (product.customMeta?.marqo_data) {
      title += `; ${product.customMeta?.marqo_data}`;
    }
    if (product.attributes?.length) {
      title += `; ${(
        product.attributes?.map((attr) => attr.key + ': ' + attr.values?.map((val) => val.value)?.join(', ')) || []
      ).join('; ')}`;
    }
    return {
      _id: 'product_' + product.id,
      title: title,
    };
  };

  private fetchMarqo = ({
    index,
    path,
    body,
    method = 'POST',
  }: {
    index: string;
    path: string;
    body?: any;
    method?: string;
  }) => {
    const { marqo_url, secret } = this.getSettings();
    if (!marqo_url) return;

    return fetch(`${marqo_url}/indexes/${index}/${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: secret ? `Bearer ${this.getSettings().secret}` : undefined,
      },
      body: body ? JSON.stringify(body) : undefined,
    })
      .then((res) => res.json())
      .catch((err) => logger.error(`Marqo-plugin error: ${err}`));
  };

  public upsertProducts = async (products: TProduct[]) => {
    const { index_name } = this.getSettings();
    if (!index_name) return;
    const documents = products.map(this.mapProduct);

    logger.log('Marqo upsert documents: ', JSON.stringify(documents?.map((d) => d._id)));
    return this.fetchMarqo({ index: index_name, path: 'documents', body: documents });
  };

  public deleteDocuments = async (ids: string[]) => {
    const { index_name } = this.getSettings();
    if (!index_name) return;

    logger.log('Marqo delete documents: ', ids);
    return this.fetchMarqo({ index: index_name, path: 'documents/delete-batch', body: ids });
  };

  public deleteProducts = async (ids: number[]) => {
    return this.deleteDocuments(ids.map((id) => this.mapProduct({ id })).map((p) => p._id));
  };

  public searchProducts = async ({
    query,
    limit,
    offset,
  }: {
    query: string;
    limit?: number;
    offset?: number;
  }): Promise<{ id: number; score: number }[] | undefined> => {
    const { index_name } = this.getSettings();
    if (!index_name) return;

    const result = await this.fetchMarqo({
      index: index_name,
      path: 'search',
      body: {
        q: query,
        limit: limit || 20,
        offset,
      },
    });

    if (!result?.hits) {
      logger.error('Marqo-plugin: Failed to search products', JSON.stringify(result, null, 2));
    }

    return result?.hits
      ?.map((hit) => ({
        id: Number(hit._id.replace('product_', '')),
        score: hit._score,
      }))
      .filter((hit) => !isNaN(hit.id));
  };

  public syncAllProducts = async () => {
    const { index_name } = this.getSettings();
    if (!index_name) return false;

    const client = getGraphQLClient();

    let success = false;

    for (let i = 1; i < 100; i++) {
      const products = await client.getProducts({
        pagedParams: { pageSize: 100, pageNumber: i },
        customFragment: gql`
          fragment ProductShortFragment on Product {
            id
            name
            attributes {
              key
              values {
                value
              }
            }
            customMeta(keys: ["marqo_data"])
          }
        `,
        customFragmentName: 'ProductShortFragment',
      });
      if (!products?.elements?.length) break;

      const result = await this.upsertProducts(products.elements);

      if (!result?.items?.length) {
        logger.log(`Marqo-plugin: Failed to create/update ${products?.elements?.length} products`);
      } else {
        const statuses = {};
        for (const item of result.items) {
          statuses[item.result] = (statuses[item.result] || 0) + 1;
        }
        logger.log(`Marqo-plugin: Sync completed. Results: ${JSON.stringify(statuses, null, 2)}`);
        success = true;
      }
    }

    return success;
  };

  public deleteIndex = async (indexName: string) => {
    logger.log(`Marqo-plugin: deleting index ${indexName}`);
    return this.fetchMarqo({
      method: 'DELETE',
      index: indexName,
      path: '',
    });
  };
}

export const marqoClient = new MarqoClient();
