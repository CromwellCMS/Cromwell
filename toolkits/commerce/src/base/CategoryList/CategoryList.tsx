import { DocumentNode, gql } from '@apollo/client';
import { TAttribute, TCromwellBlock, TGetStaticProps, TPagedList, TProduct, TProductCategory } from '@cromwell/core';
import {
  CContainer,
  CList,
  getGraphQLClient,
  getGraphQLErrorInfo,
  TCList,
  TCListProps,
  TPaginationProps,
  usePagePropsContext,
} from '@cromwell/core-frontend';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import React, { useEffect, useRef } from 'react';

import { removeUndefined } from '../../helpers/removeUndefined';
import { useModuleState } from '../../helpers/state';
import { useStoreAttributes } from '../../helpers/useStoreAttributes';
import { ProductCard as BaseProductCard, ProductCardProps } from '../ProductCard/ProductCard';
import styles from './CategoryList.module.scss';

type ServerSideData = {
  firstPage?: TPagedList<TProduct> | null;
  category?: TProductCategory | null;
  attributes?: TAttribute[];
}

type GetStaticPropsData = {
  'ccom_category_list'?: ServerSideData;
}

export type CategoryListProps = {
  data?: ServerSideData;
  listId?: string;
  style?: React.CSSProperties;
  classes?: Partial<Record<'root' | 'list', string>>;
  elements?: {
    ProductCard?: React.ComponentType<ProductCardProps>;
    Pagination?: React.ComponentType<TPaginationProps>;
  }
  listProps?: TCListProps<TProduct, any>;
}

export function CategoryList(props: CategoryListProps) {
  const { listProps } = props;
  const pageProps = usePagePropsContext<GetStaticPropsData>();
  const data: ServerSideData = Object.assign({}, pageProps.pageProps?.ccom_category_list, props.data);
  const { category } = data;
  const { ProductCard = BaseProductCard, Pagination } = props?.elements ?? {};
  const attributes = useStoreAttributes(data.attributes);
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
    <CContainer id="ccom_category"
      className={clsx(styles.CategoryList, props.classes?.root)}
      style={props.style}
    >
      {category && (
        <CList<TProduct>
          editorHidden
          className={clsx(props.classes?.list)}
          id={listId.current}
          blockRef={(block) => listInst.current = block}
          ListItem={(p) => {
            return (
              <div className={styles.productWrapper} key={p.data?.id}>
                <ProductCard
                  data={p.data}
                  attributes={attributes}
                />
              </div>
            )
          }}
          usePagination
          useShowMoreButton
          useQueryPagination
          disableCaching
          pageSize={20}
          firstBatch={data?.firstPage}
          loader={async (params) => {
            return client?.getProductsFromCategory(category.id, params)
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
    </CContainer>
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

    const category = slug && (await client?.getProductCategoryBySlug(slug).catch(e => {
      console.error(`CategoryList::getProps for slug ${slug} get category error: `, getGraphQLErrorInfo(e))
    })) || null;

    if (!category) {
      return {
        notFound: true,
      }
    }

    const firstPage = category?.id && (await client?.getProductsFromCategory(category.id,
      { pageSize: 20 },
      options?.customFragment ?? gql`
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
      options?.customFragmentName ?? 'ProductShortFragment'
    ).catch(e => {
      console.error(`CategoryList::getProps for slug ${slug} get firstPage error: `, getGraphQLErrorInfo(e));
    })) || null;

    const attributes = (await client.getAttributes().catch(e => {
      console.error(`CategoryList::getProps for slug ${slug} get attributes error: `, getGraphQLErrorInfo(e));
    })) || null;

    return {
      ...originProps,
      props: {
        ...(originProps.props ?? {}),
        ccom_category_list: removeUndefined({
          category,
          firstPage,
          attributes,
          slug,
        })
      }
    }
  }

  return getProps;
}

CategoryList.useData = (): ServerSideData | undefined => {
  const pageProps = usePagePropsContext<GetStaticPropsData>();
  return pageProps.pageProps?.ccom_category_list;
}
