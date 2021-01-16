import { TProductReview } from '@cromwell/core';
import { Card } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';

import styles from './ReviewItem.module.scss';


export const ReviewItem = (props: {
    data?: TProductReview;
}) => {
    const data = props.data;
    return (
        <Card className={styles.ReviewItem}>
            {data && (
                <>
                    <div className={styles.header}>
                        <p className={styles.userName}>{data.userName}</p>
                        <Rating name="read-only" value={data.rating} precision={0.5} readOnly />
                    </div>
                    <h4 className={styles.title}>{data.title}</h4>
                    <p className={styles.description}>{data.description}</p>
                </>
            )}
        </Card >
    )
}