import { CategoryFilter, MuiCategoryList, MuiCategorySort } from '@cromwell/toolkit-commerce';
import { CContainer, EntityHead } from '@cromwell/core-frontend';
import clsx from 'clsx';
import React, { ReactElement } from 'react';

import Layout from '../../components/layout/Layout';
import { ProductCard } from '../../components/productCard/ProductCard';
import commonStyles from '../../styles/common.module.scss';
import styles from '../../styles/pages/Category.module.scss';

import type { TPageWithLayout } from '../_app';

const ProductCategory: TPageWithLayout = () => {
  const categoryData = MuiCategoryList.useData();
  const { category } = categoryData ?? {};

  return (
    <CContainer id="category_1" className={clsx(commonStyles.content, styles.content)}>
      <CContainer id="category_3" className={styles.sidebar}>
        <CategoryFilter />
      </CContainer>
      <CContainer id="category_2" className={styles.main}>
        <CContainer id="category_4" className={styles.header}>
          <h1 className={styles.title}>{category?.name ?? ''}</h1>
          <div className={styles.sort}>
            <MuiCategorySort />
          </div>
        </CContainer>
        <EntityHead
          entity={category}
          useFallback
        />
        <MuiCategoryList
          elements={{
            ProductCard: ProductCard,
          }}
        />
        <CContainer id="category_14" style={{ paddingLeft: '20px' }}>
          {category?.description && (
            <div
              className={styles.description}
              dangerouslySetInnerHTML={{ __html: category.description }}
            ></div>
          )}
        </CContainer>
      </CContainer>
    </CContainer>
  );
}

ProductCategory.getLayout = (page: ReactElement) => {
  return (
    <Layout>
      {page}
    </Layout >
  )
}

export const getStaticProps = CategoryFilter.withGetProps(MuiCategoryList.withGetProps());

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export default ProductCategory;
