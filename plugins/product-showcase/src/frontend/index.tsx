import { gql } from '@apollo/client';
import {
  ESharedComponentNames,
  getRandStr,
  getSharedComponent,
  TFrontendPluginProps,
  TGetPluginStaticProps,
  TPagedList,
  TProduct,
} from '@cromwell/core';
import { CGallery, getGraphQLClient } from '@cromwell/core-frontend';
import React, { useEffect, useRef, useState } from 'react';

import { DefaultProductCard } from './ProductCard';

type ProductShowcaseProps = {
  slug?: string | null;
};

const ProductShowcase = (
  props: TFrontendPluginProps<
    ProductShowcaseProps,
    {
      categorySlug: string;
      categoryId: number;
      productSlug: string;
    }
  >,
): JSX.Element => {
  const galleryId = useRef(`ProductShowcase_${getRandStr(5)}`);
  const [products, setProducts] = useState<TPagedList<TProduct> | undefined>();

  const getData = async () => {
    const slug = props.data?.slug;
    const client = getGraphQLClient();
    let data;
    try {
      data = await client?.query({
        query: gql`
          query pluginProductShowcase($data: PluginProductShowcase_PageData) {
            pluginProductShowcase(data: $data) {
              pagedMeta {
                pageSize
              }
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
              }
            }
          }
        `,
        variables: {
          data: {
            pageSlug: slug,
            categorySlug: props.instanceSettings?.categorySlug,
            categoryId: props.instanceSettings?.categoryId,
            productSlug: props.instanceSettings?.productSlug,
          },
        },
      });
      setProducts(data?.data?.pluginProductShowcase);
    } catch (e: any) {
      console.error('ProductShowcase::getStaticProps', e, JSON.stringify(e?.result?.errors ?? null), null, 2);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Try to load component if a Theme has already defined common Product view
  let ProductComp = getSharedComponent(ESharedComponentNames.ProductCard);
  if (!ProductComp) {
    // Default view otherwise
    ProductComp = DefaultProductCard;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        padding: '10px 0',
      }}
    >
      <CGallery
        editorHidden
        style={{ height: '100%' }}
        id={galleryId.current}
        gallery={{
          slides:
            products?.elements?.map((product) => {
              return (
                <div style={{ margin: '0 10px' }}>
                  <div style={{ margin: '0 auto' }}>
                    {ProductComp && <ProductComp product={product} key={product.id} />}
                  </div>
                </div>
              );
            }) ?? [],
          loop: true,
          navigation: true,
          pagination: true,
          slideMinWidth: 200,
          slideMaxWidth: 350,
          autoHeight: true,
        }}
      />
    </div>
  );
};

export const getStaticProps: TGetPluginStaticProps<ProductShowcaseProps> = async (context) => {
  // slug of a product page
  const slug = context?.params?.slug ?? null;
  return {
    props: {
      slug: typeof slug === 'string' ? slug : null,
    },
  };
};

export default ProductShowcase;
