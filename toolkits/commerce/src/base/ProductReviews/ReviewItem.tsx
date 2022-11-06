import { TProductReview } from '@cromwell/core';
import clsx from 'clsx';
import { format } from 'date-fns';
import React from 'react';

import { BaseRating } from '../shared/Rating';
import { ProductReviewsProps } from './ProductReviews';
import styles from './ReviewItem.module.scss';

export type ReviewItemProps = {
  data?: TProductReview;
  parentProps: ProductReviewsProps;
};

/** @internal */
export const ReviewItem = (props: ReviewItemProps) => {
  const data = props.data;
  const { classes, elements } = props.parentProps;
  const { Rating = BaseRating } = elements ?? {};
  return (
    <div className={clsx(styles.ReviewItem, classes?.ReviewItem)}>
      {data && (
        <>
          <Rating name="read-only" value={data.rating} precision={0.5} readOnly />
          <div className={clsx(styles.itemHeader, classes?.itemHeader)}>
            <p className={clsx(styles.itemUsername, classes?.itemUsername)}>{data.userName}</p>
            <p className={clsx(styles.itemCreateDate, classes?.itemCreateDate)}>
              {data?.createDate ? format(Date.parse(String(data.createDate)), 'd MMMM yyyy') : ''}
            </p>
          </div>
          <h4 className={clsx(styles.itemTitle, classes?.itemTitle)}>{data.title}</h4>
          <p className={clsx(styles.itemDescription, classes?.itemDescription)}>{data.description}</p>
        </>
      )}
    </div>
  );
};
