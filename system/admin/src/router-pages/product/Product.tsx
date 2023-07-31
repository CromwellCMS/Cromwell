import { gql } from '@apollo/client';
import { EDBEntity, removeUndefinedOrNull, TProduct } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import queryString from 'query-string';
import React, { useState } from 'react';

import EntityEdit from '../../components/entity/entityEdit/EntityEdit';
import { productListInfo, productPageInfo } from '../../constants/PageInfos';
import { getCustomMetaFor, getCustomMetaKeysFor } from '../../helpers/customFields';
import { Header } from './components/Header';
import { PageContent } from './components/PageContent';
import { ProductContext, TProductStore } from './contexts/Product';
import { useTabs } from './hooks/useTabs';

export default function ProductPage() {
  const [store, setStore] = useState<TProductStore>({
    tab: Number(queryString.parse(window.location.search).tab || '0'),
    productRef: { data: null },
  });
  const client = getGraphQLClient();
  const [activeTabNum] = useTabs({ store, setStore });

  return (
    <ProductContext.Provider value={{ store, setStore }}>
      <EntityEdit
        entityCategory={EDBEntity.Product}
        entityListRoute={productListInfo.route}
        entityBaseRoute={productPageInfo.baseRoute}
        listLabel="Products"
        entityLabel="Product"
        defaultPageName="product"
        getById={(id) => {
          return client.getProductById(
            id,
            gql`
          fragment AdminPanelProductFragment on Product {
              id
              slug
              createDate
              updateDate
              isEnabled
              pageTitle
              pageDescription
              meta {
                  keywords
              }
              name
              price
              oldPrice
              sku
              mainImage
              images
              description
              descriptionDelta
              views
              mainCategoryId
              stockAmount
              stockStatus
              manageStock
              categories {
                  id
                  name
                  parent {
                    id
                  }
              }
              customMeta (keys: ${JSON.stringify(getCustomMetaKeysFor(EDBEntity.Product))})
              attributes {
                  key
                  values {
                      value
                  }
              }
              variants {
                  id
                  name
                  price
                  oldPrice
                  sku
                  mainImage
                  images
                  description
                  descriptionDelta
                  stockAmount
                  stockStatus
                  manageStock
                  attributes
                  customMeta (keys: ${JSON.stringify(getCustomMetaKeysFor(EDBEntity.ProductVariant))})
              }
          }`,
            'AdminPanelProductFragment',
          );
        }}
        onSave={async (data) => {
          const product = {
            ...Object.assign({}, removeUndefinedOrNull(store.productRef?.data), removeUndefinedOrNull(data)),
          };

          const productAttributes = product.attributes?.map((attr) => ({
            key: attr.key,
            values: attr.values
              ? attr.values.map((val) => ({
                  value: val.value,
                }))
              : [],
          }));

          const categoryIds = product?.categories?.map((cat) => cat.id) || [];
          if (product.mainCategoryId && !categoryIds.includes(product.mainCategoryId)) {
            categoryIds.push(product.mainCategoryId);
          }

          return {
            name: product.name,
            categoryIds,
            mainCategoryId: product.mainCategoryId,
            price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
            oldPrice: typeof product.oldPrice === 'string' ? parseFloat(product.oldPrice) : product.oldPrice,
            sku: product.sku,
            mainImage: product.mainImage,
            images: product.images,
            stockStatus: product.stockStatus ?? 'In stock',
            stockAmount: product.stockAmount,
            manageStock: product.manageStock,
            description: product.description,
            descriptionDelta: product.descriptionDelta,
            slug: product.slug,
            attributes: productAttributes,
            pageTitle: product.pageTitle,
            pageDescription: product.pageDescription,
            meta: product.meta && {
              keywords: product.meta.keywords,
            },
            variants: product.variants?.map((variant) => ({
              id: typeof variant.id === 'number' ? variant.id : undefined,
              name: variant.name,
              price: typeof variant.price === 'string' ? parseFloat(variant.price) : variant.price,
              oldPrice: typeof variant.oldPrice === 'string' ? parseFloat(variant.oldPrice) : variant.oldPrice,
              sku: variant.sku,
              mainImage: variant.mainImage,
              images: variant.images,
              description: variant.description,
              descriptionDelta: variant.descriptionDelta,
              stockAmount: variant.stockAmount,
              stockStatus: variant.stockStatus,
              manageStock: variant.manageStock,
              attributes: variant.attributes,
              customMeta: variant.customMeta,
            })),
            customMeta: Object.assign({}, product.customMeta, await getCustomMetaFor(EDBEntity.Product)),
            isEnabled: product.isEnabled,
          } as Omit<TProduct, 'id'>;
        }}
        update={client.updateProduct}
        create={client.createProduct}
        deleteOne={client.deleteProduct}
        customElements={{
          getEntityFields: (props) => <PageContent {...props} />,
          getEntityHeaderCenter: () => <Header />,
        }}
        disableMeta={activeTabNum !== 0}
      />
    </ProductContext.Provider>
  );
}
