import { TProduct } from '@cromwell/core';
import { getCStore, Link } from '@cromwell/core-frontend';
import { IconButton, useMediaQuery, useTheme } from '@material-ui/core';
import { AddShoppingCart as AddShoppingCartIcon } from '@material-ui/icons';
import { Rating } from '@material-ui/lab';
import clsx from 'clsx';
import React, { Component, useEffect, useRef, useState } from 'react';

import commonStyles from '../../styles/common.module.scss';
import styles from './ProductCard.module.scss';

export const ProductCard = (props?: {
    data?: TProduct, className?: string,
    variant?: 'grid' | 'list'
}) => {
    const data = props?.data;
    const productLink = `/product/${data?.slug ?? data?.id}`;
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [imageHeigth, setImageHeigth] = useState(300);
    const cstore = getCStore();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

    useEffect(() => {
        if (wrapperRef && wrapperRef.current) {
            const width = props?.variant !== 'list' ? wrapperRef.current.offsetWidth : wrapperRef.current.offsetHeight;
            setImageHeigth(width);
        }
    }, []);

    return (
        <div className={clsx(styles.Product, commonStyles.onHoverLinkContainer,
            props?.className, props?.variant === 'list' ? styles.listVariant : undefined)} ref={wrapperRef}>
            <div className={styles.imageBlock}
            // style={{ height: isMobile ? 'auto' : imageHeigth }}
            >
                <Link href={productLink}>
                    <a><img className={styles.image} src={data?.mainImage} /></a>
                </Link>
            </div>
            <div className={styles.caption}>
                <div>
                    <Link href={productLink}>
                        <a className={clsx(styles.productName, commonStyles.onHoverLink)}>{data?.name}</a>
                    </Link>
                </div>
                {data?.description && (
                    <div className={styles.description}>
                        <div dangerouslySetInnerHTML={{ __html: data?.description }}></div>
                        <div className={styles.descriptionGradient}></div>
                    </div>
                )}
                <div className={styles.priceCartBlock}>
                    <div className={styles.priceBlock}>
                        {(data?.oldPrice !== undefined && data?.oldPrice !== null) && (
                            <p className={styles.oldPrice}>{cstore.getPriceWithCurrency(data.oldPrice)}</p>
                        )}
                        <p className={styles.price}>{cstore.getPriceWithCurrency(data?.price)}</p>
                    </div>
                </div>
                <div>
                    <IconButton
                        aria-label="Add to cart"
                        onClick={() => { }}
                    >
                        <AddShoppingCartIcon />
                    </IconButton>
                </div>
                <div className={styles.ratingBlock}>
                    <Rating name="read-only" value={data?.rating?.average} precision={0.5} readOnly />
                    {(data?.rating?.reviewsNumber !== undefined && props?.variant === 'list') && (
                        <p className={styles.ratingCaption}>
                            {data?.rating?.average ? data?.rating?.average.toFixed(2) : ''} based on {data?.rating?.reviewsNumber} reviews.</p>
                    )}
                </div>
            </div>
        </div>
    )
}
