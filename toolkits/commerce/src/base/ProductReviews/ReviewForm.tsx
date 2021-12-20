import { getStoreItem, onStoreChange, removeOnStoreChange, TCromwellNotify, TProductReview, TUser } from '@cromwell/core';
import { getRestApiClient } from '@cromwell/core-frontend';
import React, { useEffect, useState } from 'react';

import { useAdapter } from '../../adapter';
import styles from './ReviewForm.module.scss';

export const ReviewForm = ({ productId, notifier }: {
  productId: number;
  notifier?: TCromwellNotify;
}) => {
  const userInfo = getStoreItem('userInfo');
  const [name, setName] = useState(userInfo?.fullName ?? '');
  const [rating, setRating] = useState<number | null>(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [canValidate, setCanValidate] = useState(false);
  const [placedReview, setPlacedReview] = useState<TProductReview | null>(null);

  const { Alert, Button, Rating, TextField, Tooltip } = useAdapter();

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
      notifier?.error?.('Failed to post review');
    }
    setIsLoading(false);

    if (reviewRes) {
      setPlacedReview(reviewRes);
    }
  }

  if (placedReview) {
    return (
      <div className={styles.reviewBox}>
        <Alert severity="success">Thank you! Your review will appear on this page after approval by the website moderator</Alert>
      </div>
    )
  }

  return (
    <div className={styles.reviewBox}>
      <h3 className={styles.reviewBoxTitle}>Write a review</h3>
      <Tooltip open={canValidate && (!name || name == '')} title="This field is required" arrow>
        <TextField label="Name"
          variant="outlined"
          size="small"
          fullWidth
          className={styles.reviewInput}
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </Tooltip>
      <Tooltip open={canValidate && (!rating)} title="This field is required" arrow>
        <Rating name="read-only"
          value={rating}
          className={styles.reviewInput}
          onChange={(e, value) => setRating(value)}
          precision={0.5}
        />
      </Tooltip>
      <TextField label="Title"
        variant="outlined"
        size="small"
        fullWidth
        className={styles.reviewInput}
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <TextField
        label="Review"
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
      <div className={styles.btnWrapper}>
        <Button variant="contained"
          color="primary"
          className={styles.dtn}
          size="large"
          onClick={handleSubmit}
          disabled={isLoading}
        >Submit</Button>
      </div>
    </div>
  );
}