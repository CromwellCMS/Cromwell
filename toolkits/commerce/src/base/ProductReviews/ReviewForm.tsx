import { getStoreItem, onStoreChange, removeOnStoreChange, TCromwellNotify, TProductReview, TUser } from '@cromwell/core';
import { CContainer, CText, getRestApiClient } from '@cromwell/core-frontend';
import React, { useEffect, useState } from 'react';

import { BaseAlert } from '../shared/Alert';
import { BaseButton } from '../shared/Button';
import { BaseRating } from '../shared/Rating';
import { BaseTextField } from '../shared/TextField';
import { BaseTooltip } from '../shared/Tooltip';
import { ProductReviewsProps } from './ProductReviews';
import styles from './ReviewForm.module.scss';

export type ReviewFormProps = {
  productId: number;
  notifier?: TCromwellNotify;
  parentProps: ProductReviewsProps;
}

export const ReviewForm = ({ productId, notifier, parentProps = {} }: ReviewFormProps) => {
  const userInfo = getStoreItem('userInfo');
  const [name, setName] = useState(userInfo?.fullName ?? '');
  const [rating, setRating] = useState<number | null>(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [canValidate, setCanValidate] = useState(false);
  const [placedReview, setPlacedReview] = useState<TProductReview | null>(null);
  const { text = {}, elements } = parentProps;
  const { Alert = BaseAlert, Button = BaseButton, Rating = BaseRating,
    TextField = BaseTextField, Tooltip = BaseTooltip } = elements ?? {};

  const userInfoChange = (userInfo: TUser | undefined) => {
    setName(userInfo?.fullName ?? '');
  }

  useEffect(() => {
    onStoreChange('userInfo', userInfoChange);
    return () => {
      removeOnStoreChange('userInfo', userInfoChange);
    }
  }, []);


  const handleSubmit = async () => {
    if (!canValidate) setCanValidate(true);
    if (!name || name == '' ||
      !rating
    ) {
      return;
    }

    let reviewRes;
    setIsLoading(true);
    try {
      reviewRes = await getRestApiClient()?.placeProductReview({
        productId: productId,
        title,
        description,
        rating,
        userName: name,
        userId: userInfo?.id,
      });
    } catch (e) {
      console.error(e);
      notifier?.error?.(text.failedToSubmit ?? 'Failed to post review');
    }
    setIsLoading(false);

    if (reviewRes) {
      setPlacedReview(reviewRes);
    }
  }

  if (placedReview) {
    return (
      <div className={styles.ReviewForm}>
        <Alert severity="success">{text.submitSuccess ?? 'Thank you! Your review will appear on this page after approval by the website moderator'}</Alert>
      </div>
    )
  }

  const fieldRequired = text.fieldRequired ?? 'This field is required';

  return (
    <CContainer id="ccom_product_reviews_form" className={styles.ReviewForm}>
      <CText id="ccom_product_reviews_write_review_title" className={styles.reviewFormTitle}>{text.writeReview ?? 'Write a review'}</CText>
      <Tooltip open={canValidate && (!name || name == '')} title={fieldRequired} arrow>
        <TextField label={text.fieldNameLabel ?? 'Name'}
          name="Name"
          variant="outlined"
          size="small"
          fullWidth
          className={styles.reviewInput}
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </Tooltip>
      <Tooltip open={canValidate && (!rating)} title={fieldRequired} arrow>
        <Rating name="read-only"
          value={rating}
          className={styles.reviewInput}
          onChange={(e, value) => setRating(value)}
          precision={0.5}
        />
      </Tooltip>
      <TextField label={text.fieldTitleLabel ?? 'Title'}
        name="Title"
        variant="outlined"
        size="small"
        fullWidth
        className={styles.reviewInput}
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <TextField
        label={text.fieldReviewLabel ?? 'Review'}
        name="Review"
        variant="outlined"
        size="small"
        fullWidth
        multiline
        minRows={4}
        maxRows={20}
        className={styles.reviewInput}
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <div className={styles.submitBtnWrapper}>
        <Button variant="contained"
          color="primary"
          size="large"
          onClick={handleSubmit}
          disabled={isLoading}
        >{text.submitButton ?? 'Submit'}</Button>
      </div>
    </CContainer>
  );
}