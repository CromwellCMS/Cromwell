import { TAttribute, TCromwellPage, TGetStaticProps, TPagedList, TProduct, TProductCategory } from '@cromwell/core';
import { CContainer, CList, getGraphQLClient } from '@cromwell/core-frontend';
import React from 'react';

import { CategorySort } from '../../components/categorySort/CategorySort';
import Layout from '../../components/layout/Layout';
import layoutStyles from '../../components/layout/Layout.module.scss';
import { Pagination } from '../../components/pagination/Pagination';
import { ProductCard } from '../../components/productCard/ProductCard';
import commonStyles from '../../styles/common.module.scss';
import styles from '../../styles/pages/Category.module.scss';

interface CategoryProps {
  category?: TProductCategory | null;
  products?: TPagedList<TProduct> | null;
  attributes?: TAttribute[];
  slug?: string;
}


const ProductCategory: TCromwellPage<CategoryProps> = (props) => {
  // console.log('ProductThemePage props', props);
  const category = props.category;
  const client = getGraphQLClient();
  const listId = 'Category_ProductList';
  return (
    <Layout>
      <div className={commonStyles.content}>
        <div className={styles.content}>
          <div className={styles.sidebar}>
            <CContainer id="Category_ProductFilter" />
          </div>
          <div className={styles.main}>
            <div className={styles.header}>
              <h1 className={styles.title}>{category?.name ?? ''}</h1>
              <div className={styles.sort}>
                <CategorySort listId={listId} />
              </div>
            </div>
            {category && props.attributes && (
              <CList<TProduct>
                id={listId}
                ListItem={(p) => {
                  return (
                    <div className={styles.productWrapper}>
                      <ProductCard
                        data={p.data}
                        className={styles.product}
                        key={p.data?.id}
                        attributes={props.attributes}
                      />
                    </div>
                  )
                }}
                usePagination
                useShowMoreButton
                useQueryPagination
                disableCaching
                pageSize={20}
                scrollContainerSelector={`.${layoutStyles.Layout}`}
                firstBatch={props.products ? props.products : undefined}
                loader={async (params) => {
                  return client?.getProductsFromCategory(category.id, params)
                }}
                cssClasses={{
                  page: styles.productList
                }}
                elements={{
                  pagination: Pagination
                }}
              />
            )}
            {category?.description && (
              <div
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: category.description }}
              ></div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: TGetStaticProps = async (context): Promise<CategoryProps> => {
  const slug = context?.params?.slug;
  const client = getGraphQLClient();

  let category: TProductCategory | undefined | null = null;
  if (slug && typeof slug === 'string') {
    try {
      category = await client?.getProductCategoryBySlug(slug);
    } catch (e) {
      console.error('ProductCategory::getStaticProps 1, slug: ' + slug, e)
    }
  } else {
    console.error('ProductCategory::getStaticProps: !pid')
  }
  let products: TPagedList<TProduct> | undefined | null = null;
  if (category) {
    try {
      products = await client?.getProductsFromCategory(category.id,
        { pageSize: 20 })
    } catch (e) {
      console.error('ProductCategory::getStaticProps 2, slug: ' + slug, e)
    }
  }

  let attributes: TAttribute[] | undefined;

  try {
    attributes = await client?.getAttributes();
  } catch (e) {
    console.error('Product::getStaticProps', e)
  }

  return {
    slug: slug as string,
    category: category ? category : null,
    products: products ? products : null,
    attributes
  }

}

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: true
  };
}

export default ProductCategory;
