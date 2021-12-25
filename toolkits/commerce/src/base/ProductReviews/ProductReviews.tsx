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
import React, { useRef, useEffect } from 'react';
import { useRouter } from 'next/router';

import { useAdapter } from '../../adapter';
import styles from './ProductReviews.module.scss';
import { ReviewForm, ReviewFormProps } from './ReviewForm';
import { ReviewItem, ReviewItemProps } from './ReviewItem';

export type ProductReviewsProps = {
  /**
   * Target product's ID
   */
  productId: number;
  /**
   * Override props to CList
   */
  listProps?: TCListProps<TProductReview, TListItemProps>;
  /**
   * Notifier tool
   */
  notifier?: TCromwellNotify;
  /**
   * Override title. 'Customer reviews' by default
   */
  titleText?: string;
  /**
   * Replace ReviewForm component by custom
   */
  ReviewForm?: React.ComponentType<ReviewFormProps>;
  /**
   * Replace ReviewItem component by custom
   */
  ReviewItem?: React.ComponentType<ReviewItemProps>;
}

type TListItemProps = TItemComponentProps<TProductReview, ProductReviewsProps>;

const ListItem = (props: TListItemProps) => {
  const Comp = props.listItemProps?.ReviewItem ?? ReviewItem;
  return <Comp data={props.data} key={props.data?.id} />
}

export function ProductReviews(props: ProductReviewsProps) {
  const { productId, listProps, notifier, titleText, ReviewForm: CustomReviewForm } = props;
  const reviewsInst = useRef<TCromwellBlock<TCList> | undefined>();
  const client = getGraphQLClient();
  const { Pagination } = useAdapter();
  const router = useRouter?.();
  const Form = CustomReviewForm ?? ReviewForm;

  useEffect(() => {
    const list: TCList | undefined = reviewsInst.current?.getContentInstance();
    if (list) {
      list.updateData();
    }
  }, [router?.asPath]);

  return (
    <CContainer id="product_reviews_block" className={styles.ProductReviews}>
      <CText id="product_reviews_title" className={styles.reviewsTitle}>{titleText ?? 'Customer reviews'}</CText>
      <CContainer id="product_reviews_list_container">
        <CList<TProductReview>
          id={"product_reviews_list"}
          ListItem={ListItem}
          listItemProps={props}
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
        <Form productId={productId} notifier={notifier} />
      </CContainer>
    </CContainer>
  )
}
