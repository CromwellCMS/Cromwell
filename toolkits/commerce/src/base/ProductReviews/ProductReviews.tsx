import { TCromwellBlock, TCromwellNotify, TProductReview } from '@cromwell/core';
import {
  CContainer,
  CList,
  CText,
  getGraphQLClient,
  TCList,
  TCListProps,
  TListItemProps,
  TPaginationProps,
} from '@cromwell/core-frontend';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import React, { useEffect, useRef } from 'react';

import { getNotifier } from '../../helpers/notifier';
import { TBaseAlert } from '../shared/Alert';
import { TBaseButton } from '../shared/Button';
import { TBaseRating } from '../shared/Rating';
import { TBaseTextField } from '../shared/TextField';
import { TBaseTooltip } from '../shared/Tooltip';
import styles from './ProductReviews.module.scss';
import { ReviewForm, ReviewFormProps } from './ReviewForm';
import { ReviewItem, ReviewItemProps } from './ReviewItem';

export type ProductReviewsProps = {
  classes?: Partial<
    Record<
      | 'root'
      | 'ReviewForm'
      | 'reviewFormTitle'
      | 'reviewInput'
      | 'submitBtnWrapper'
      | 'ReviewItem'
      | 'itemHeader'
      | 'itemUsername'
      | 'itemCreateDate'
      | 'itemTitle'
      | 'itemDescription',
      string
    >
  >;

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
    Tooltip?: TBaseTooltip;
  };

  text?: {
    writeReview?: string;
    fieldRequired?: string;
    fieldNameLabel?: string;
    fieldTitleLabel?: string;
    fieldReviewLabel?: string;
    submitButton?: string;
    failedToSubmit?: string;
    submitSuccess?: string;
  };

  /**
   * Target product's ID. Required
   */
  productId: number;
  /**
   * Override props to CList
   */
  listProps?: Partial<TCListProps<TProductReview, TReviewListItemProps>>;
  /**
   * Notifier tool
   */
  notifier?: TCromwellNotify;

  /**
   * Disable editing of inner blocks in Theme editor
   */
  disableEdit?: boolean;
};

/** @internal */
type TReviewListItemProps = TListItemProps<TProductReview, ProductReviewsProps>;

/** @internal */
const ListItem = (props: TReviewListItemProps) => {
  const Comp = props.listItemProps?.elements?.ReviewItem ?? ReviewItem;
  return <Comp data={props.data} key={props.data?.id} parentProps={props.listItemProps!} />;
};

/**
 * Displays customer reviews of a product. Fetches data client-side
 */
export function ProductReviews(props: ProductReviewsProps) {
  const { productId, listProps, notifier = getNotifier(), elements, classes, disableEdit } = props;
  const reviewsInst = useRef<TCromwellBlock<TCList> | undefined>();
  const client = getGraphQLClient();
  const router = useRouter();
  const Form = elements?.ReviewForm ?? ReviewForm;
  const Title =
    elements?.Title ??
    (() => (
      <CText id="ccom_product_reviews_title" className={styles.reviewsTitle} editorHidden={disableEdit}>
        Customer reviews
      </CText>
    ));

  useEffect(() => {
    const list: TCList | undefined = reviewsInst.current?.getContentInstance();
    if (list) {
      list.updateData();
    }
  }, [router?.asPath]);

  if (!productId) {
    console.error('ccom_ProductReviews: you must provide productId prop');
    return null;
  }

  return (
    <CContainer
      id="ccom_product_reviews_block"
      className={clsx(styles.ProductReviews, classes?.root)}
      editorHidden={disableEdit}
    >
      <Title />
      <CContainer id="ccom_product_reviews_list_container" editorHidden={disableEdit}>
        <CList<TProductReview>
          id={'ccom_product_reviews_list'}
          ListItem={ListItem}
          listItemProps={props}
          usePagination
          useShowMoreButton
          editorHidden
          disableCaching
          noDataLabel={'No reviews at the moment. Be the first to leave one!'}
          pageSize={10}
          blockRef={(block) => (reviewsInst.current = block)}
          loader={async (params) => {
            return client.getProductReviews({
              pagedParams: params,
              filterParams: {
                productId,
                approved: true,
              },
            });
          }}
          elements={{
            pagination: elements?.Pagination,
          }}
          {...((listProps as Partial<TCListProps<TProductReview, TReviewListItemProps>>) ?? {})}
        />
        <Form productId={productId} notifier={notifier} parentProps={props} />
      </CContainer>
    </CContainer>
  );
}
