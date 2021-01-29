import React, { Component, useEffect, useRef, useState } from 'react';
import { TPost } from '@cromwell/core/es';
import { TProduct } from '@cromwell/core';
import { getCStore, Link } from '@cromwell/core-frontend';
import { IconButton, useMediaQuery, useTheme } from '@material-ui/core';
import { AddShoppingCart as AddShoppingCartIcon } from '@material-ui/icons';
import { Rating } from '@material-ui/lab';
import clsx from 'clsx';

import commonStyles from '../../styles/common.module.scss';
import styles from './PostCard.module.scss';


export const PostCard = (props?: {
    data?: TPost,
    className?: string,
}) => {
    const data = props?.data;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
    const postLink = `/blog/${data?.slug ?? data?.id}`;

    return (
        <div className={styles.PostCard}>
            <div className={styles.imageBlock}
            // style={{ height: isMobile ? 'auto' : imageHeigth }}
            >
                <Link href={postLink}>
                    <a><img className={styles.image} src={data?.mainImage} /></a>
                </Link>
            </div>
            <div className={styles.caption}>
                <div>
                    <Link href={postLink}>
                        <a className={clsx(styles.productName, commonStyles.onHoverLink)}>{data?.title}</a>
                    </Link>
                </div>
                {data?.pageDescription && (
                    <div className={styles.description}>
                        <p>{data?.pageDescription}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
