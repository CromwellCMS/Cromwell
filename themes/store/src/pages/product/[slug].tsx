import { removeUndefined, TAttribute, TGetStaticProps, TProduct } from '@cromwell/core';
import { CContainer, CPlugin, CText, EntityHead, getGraphQLClient, TGraphQLErrorInfo } from '@cromwell/core-frontend';
import { MuiBreadcrumbs, MuiProductReviews } from '@cromwell/toolkit-commerce';
import clsx from 'clsx';
import React, { ReactElement } from 'react';

import Layout from '../../components/layout/Layout';
import ProductDetails from '../../components/productDetails/ProductDetails';
import commonStyles from '../../styles/common.module.scss';
import styles from '../../styles/pages/Product.module.scss';

import type { TPageWithLayout } from '../_app';

export interface ProductProps {
  product?: TProduct | null;
  attributes?: TAttribute[] | null;
}

const Product: TPageWithLayout<ProductProps> = (props) => {
  const { product } = props ?? {};

  return (
    <CContainer className={clsx(commonStyles.content, styles.ProductPage)} id="product-1">
      <EntityHead entity={product} useFallback />
      <MuiBreadcrumbs classes={{ root: styles.breadcrumbs }} showHome />
      <ProductDetails {...props} />
      <CContainer id="Product_ProductShowcase_container">
        <CText
          id="product_showcase-title"
          style={{
            margin: '40px 20px 10px 20px',
            fontWeight: 600,
            fontSize: '26px',
          }}
        >
          Similar items
        </CText>
        <CPlugin
          id="Product_ProductShowcase"
          plugin={{
            pluginName: '@cromwell/plugin-product-showcase',
          }}
          blockName="Product showcase"
        />
      </CContainer>
      <CContainer id="product_reviewsBlock" className={styles.reviewsBlock}>
        {product?.id && <MuiProductReviews productId={product?.id} />}
      </CContainer>
    </CContainer>
  );
};

Product.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default Product;

const getProps: TGetStaticProps<ProductProps> = async (context) => {
  const slug = context?.params?.slug ?? null;
  const client = getGraphQLClient();

  const product =
    (typeof slug === 'string' &&
      (await client.getProductBySlug(slug).catch((error: TGraphQLErrorInfo) => {
        if (error.statusCode !== 404) console.error('Product::getStaticProps', error);
      }))) ||
    null;

  if (!product) {
    return {
      notFound: true,
    };
  }

  const attributes =
    (await client
      .getAttributes({ pagedParams: { pageSize: 1000 } })
      .catch((error: TGraphQLErrorInfo) => {
        console.error('Product::getStaticProps', error);
      })
      .then((data) => data && data.elements)) || null;

  return {
    props: removeUndefined({
      product,
      attributes,
    }),
  };
};

export const getStaticProps = MuiBreadcrumbs.withGetProps(getProps);

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};
