import { TProductReview } from '@cromwell/core';
import { format } from 'date-fns';
import React from 'react';

import { BaseRating } from '../shared/Rating';
import { ProductReviewsProps } from './ProductReviews';
import styles from './ReviewItem.module.scss';

export type ReviewItemProps = {
  data?: TProductReview;
  parentProps: ProductReviewsProps;
}

export const ReviewItem = (props: ReviewItemProps) => {
  const data = props.data;
  const { Rating = BaseRating } = props.parentProps?.elements ?? {};
  return (
    <div className={styles.ReviewItem}>
      {data && (
        <>
          <Rating name="read-only" value={data.rating} precision={0.5} readOnly />
          <div className={styles.header}>
            <p className={styles.userName}>{data.userName}</p>
            <p className={styles.createDate}>{data?.createDate ? format(Date.parse(String(data.createDate)), 'd MMMM yyyy') : ''}</p>
          </div>
          <h4 className={styles.title}>{data.title}</h4>
          <p className={styles.description}>{data.description}</p>
        </>
      )}
    </div >
  )
}