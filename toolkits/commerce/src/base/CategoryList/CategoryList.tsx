import { DocumentNode, gql } from '@apollo/client';
import { removeUndefined, TCromwellBlock, TGetStaticProps, TPagedList, TProduct, TProductCategory } from '@cromwell/core';
import {
  CList,
  getGraphQLClient,
  TGraphQLErrorInfo,
  TCList,
  TCListProps,
  TPaginationProps,
  useAppPropsContext,
} from '@cromwell/core-frontend';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import React, { useEffect, useRef } from 'react';

import { useModuleState } from '../../helpers/state';
import { useStoreAttributes } from '../../helpers/useStoreAttributes';
import { ProductCard as BaseProductCard, ProductCardProps } from '../ProductCard/ProductCard';
import styles from './CategoryList.module.scss';

export type CategoryListData = {
  firstPage?: TPagedList<TProduct> | null;
  category: TProductCategory | null;
}

/** @internal */
type GetStaticPropsData = {
  'ccom_category_list'?: CategoryListData;
}

export type CategoryListProps = {
  classes?: Partial<Record<'root' | 'list', string>>;

  elements?: {
    ProductCard?: React.ComponentType<ProductCardProps>;
    Pagination?: React.ComponentType<TPaginationProps>;
  }

  data?: CategoryListData;

  /**
   * Provide custom CBlock id to use for underlying CList 
   */
  listId?: string;

  /**
   * CList props to pass, such as `pageSize`, etc.
   */
  listProps?: Partial<TCListProps<TProduct, any>>;

  /**
   * Override product card props
   */
  cardProps?: Partial<ProductCardProps>;
}

/**
 * Renders product list on category page  
 * 
 * - `withGetProps` - required. Data on the frontend can be overridden  
 * - `useData` - available
 */
export function CategoryList(props: CategoryListProps) {
  const { listProps, cardProps } = props;
  const appProps = useAppPropsContext<GetStaticPropsData>();
  const data: CategoryListData = Object.assign({}, appProps.pageProps?.ccom_category_list, props.data);
  const { category } = data;
  const { ProductCard = BaseProductCard, Pagination } = props?.elements ?? {};
  const attributes = useStoreAttributes();
  const moduleState = useModuleState();

  const listInst = useRef<TCromwellBlock<TCList> | undefined>();
  const prevPath = useRef<string | undefined>();
  const listId = useRef<string>(props.listId ?? 'ccom_category_product_list');
  const router = useRouter();
  const client = getGraphQLClient();

  useEffect(() => {
    if (prevPath.current) {
      const list: TCList | undefined = listInst.current?.getContentInstance();
      if (list) {
        list.updateData();
      }
    }
    prevPath.current = router?.asPath;

    moduleState.setCategoryListId(listId.current);
  }, [router?.asPath]);

  return (
    <div
      className={clsx(styles.CategoryList, props.classes?.root)}
    >
      {category && (
        <CList<TProduct>
          editorHidden
          className={clsx(props.classes?.list)}
          id={listId.current}
          blockRef={(block) => listInst.current = block}
          ListItem={(p) => {
            if (!p.data) return null;
            return (
              <div className={styles.productWrapper} key={p.data?.id}>
                <ProductCard
                  product={p.data}
                  attributes={attributes}
                  {...cardProps}
                />
              </div>
            );
          }}
          usePagination
          useQueryPagination
          disableCaching
          pageSize={20}
          firstBatch={data?.firstPage}
          loader={async (params) => {
            return client.getProducts({ pagedParams: params, filterParams: { categoryId: category.id } });
          }}
          cssClasses={{
            page: styles.productList
          }}
          elements={{
            pagination: Pagination
          }}
          {...(listProps ?? {})}
        />
      )}
    </div>
  )
}

CategoryList.withGetProps = (originalGetProps?: TGetStaticProps, options?: {
  customFragment?: DocumentNode;
  customFragmentName?: string;
}) => {
  const getProps: TGetStaticProps<GetStaticPropsData> = async (context) => {
    const originProps: any = (await originalGetProps?.(context)) ?? {};
    const contextSlug = context?.params?.slug;
    const slug = (contextSlug && typeof contextSlug === 'string') && contextSlug;
    const client = getGraphQLClient();

    const category = slug && (await client?.getProductCategoryBySlug(slug).catch((e: TGraphQLErrorInfo) => {
      if (e.statusCode !== 404)
        console.error(`CategoryList::getProps for slug ${slug} get category error: `, e);
    })) || null;

    if (!category) {
      return {
        notFound: true,
      }
    }

    const firstPage = category?.id && (await client.getProducts({
      pagedParams: { pageSize: 20 },
      filterParams: { categoryId: category.id },
      customFragment: options?.customFragment ?? gql`
      fragment ProductShortFragment on Product {
        id
        slug
        isEnabled
        name
        price
        oldPrice
        sku
        mainImage
        rating {
          average
          reviewsNumber
        }
      }`,
      customFragmentName: options?.customFragmentName ?? 'ProductShortFragment',
    }).catch(e => {
      console.error(`CategoryList::getProps for slug ${slug} get firstPage error: `, e);
    })) || null;

    return {
      ...originProps,
      props: {
        ...(originProps.props ?? {}),
        ccom_category_list: removeUndefined({
          category,
          firstPage,
          slug,
        })
      }
    }
  }

  return getProps;
}

CategoryList.useData = (): CategoryListData | undefined => {
  const appProps = useAppPropsContext<GetStaticPropsData>();
  return appProps.pageProps?.ccom_category_list;
}
