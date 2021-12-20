import { TCromwellBlock, TCromwellNotify, TProductReview } from '@cromwell/core';
import {
  CContainer,
  CList,
  CText,
  getGraphQLClient,
  TCList,
  TCListProps,
  TItemComponentProps,
} from '@cromwell/core-frontend';
import React, { useRef } from 'react';

import { useAdapter } from '../../adapter';
import styles from './ProductReviews.module.scss';
import { ReviewForm } from './ReviewForm';
import { ReviewItem } from './ReviewItem';

type TListItemProps = TItemComponentProps<TProductReview, any>;

const ListItem = (props: TListItemProps) => {
  return <ReviewItem data={props.data} key={props.data?.id} />
}

export function ProductReviews({ productId, listProps, notifier, title }: {
  productId: number;
  listProps?: TCListProps<TProductReview, TListItemProps>;
  notifier?: TCromwellNotify;
  title?: string;
}) {
  const reviewsInst = useRef<TCromwellBlock<TCList> | undefined>();
  const client = getGraphQLClient();
  const { Pagination } = useAdapter();

  return (
    <CContainer id="product_reviews_block">
      <CText id="product_reviews_title" className={styles.reviewsTitle}>{title ?? 'Customer reviews'}</CText>
      <CContainer id="product_reviews_list_container">
        <CList<TProductReview>
          id={"product_reviews_list"}
          ListItem={ListItem}
          usePagination
          useShowMoreButton
          editorHidden
          disableCaching
          noDataLabel={'No reviews at the moment. Be the first to leave one!'}
          pageSize={10}
          blockRef={(block) => reviewsInst.current = block}
          loader={async (params) => {
            return client.getFilteredProductReviews({
              pagedParams: params,
              filterParams: {
                productId,
                approved: true,
              }
            });
          }}
          elements={{
            pagination: Pagination
          }}
          {...(listProps ?? {})}
        />
        <ReviewForm productId={productId} notifier={notifier} />
      </CContainer>
    </CContainer>
  )
}
