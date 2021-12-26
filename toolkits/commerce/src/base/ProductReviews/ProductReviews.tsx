import { TCromwellBlock, TCromwellNotify, TProductReview } from '@cromwell/core';
import {
  CContainer,
  CList,
  CText,
  getGraphQLClient,
  TCList,
  TCListProps,
  TItemComponentProps,
  TPaginationProps,
} from '@cromwell/core-frontend';
import { useRouter } from 'next/router';
import React, { useEffect, useRef } from 'react';

import { TBaseTextField } from '../shared/TextField';
import { TBaseAlert } from '../shared/Alert';
import { TBaseButton } from '../shared/Button';
import { TBaseTooltip } from '../shared/Tooltip';
import { TBaseRating } from '../shared/Rating';
import styles from './ProductReviews.module.scss';
import { ReviewForm, ReviewFormProps } from './ReviewForm';
import { ReviewItem, ReviewItemProps } from './ReviewItem';

export type ProductReviewsProps = {
  /**
   * Target product's ID. Required
   */
  productId?: number | null;
  /**
   * Override props to CList
   */
  listProps?: TCListProps<TProductReview, TListItemProps>;
  /**
   * Notifier tool
   */
  notifier?: TCromwellNotify;

  elements?: {
    Title?: React.ComponentType;

    /**
     * Replace ReviewForm component by custom
     */
    ReviewForm?: React.ComponentType<ReviewFormProps>;
    /**
     * Replace ReviewItem component by custom
     */
    ReviewItem?: React.ComponentType<ReviewItemProps>;
    Pagination?: React.ComponentType<TPaginationProps>;
    Alert?: TBaseAlert;
    Button?: TBaseButton;
    Rating?: TBaseRating;
    TextField?: TBaseTextField;
    Tooltip?: TBaseTooltip
  }
  text?: {
    writeReview?: string;
    fieldRequired?: string;
    fieldNameLabel?: string;
    fieldTitleLabel?: string;
    fieldReviewLabel?: string;
    submitButton?: string;
    failedToSubmit?: string;
    submitSuccess?: string;
  }
}

type TListItemProps = TItemComponentProps<TProductReview, ProductReviewsProps>;

const ListItem = (props: TListItemProps) => {
  const Comp = props.listItemProps?.elements?.ReviewItem ?? ReviewItem;
  return <Comp data={props.data} key={props.data?.id} parentProps={props.listItemProps!} />
}

export function ProductReviews(props: ProductReviewsProps) {
  const { productId, listProps, notifier, elements } = props;
  const reviewsInst = useRef<TCromwellBlock<TCList> | undefined>();
  const client = getGraphQLClient();
  const router = useRouter();
  const Form = elements?.ReviewForm ?? ReviewForm;
  const Title = elements?.Title ?? (() => (
    <CText id="ccom_product_reviews_title" className={styles.reviewsTitle}>Customer reviews</CText>
  ));

  useEffect(() => {
    const list: TCList | undefined = reviewsInst.current?.getContentInstance();
    if (list) {
      list.updateData();
    }
  }, [router?.asPath]);

  if (!productId) return null;

  return (
    <CContainer id="ccom_product_reviews_block" className={styles.ProductReviews}>
      <Title />
      <CContainer id="ccom_product_reviews_list_container">
        <CList<TProductReview>
          id={"ccom_product_reviews_list"}
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
            pagination: elements?.Pagination,
          }}
          {...(listProps ?? {})}
        />
        <Form productId={productId} notifier={notifier} parentProps={props} />
      </CContainer>
    </CContainer>
  )
}
