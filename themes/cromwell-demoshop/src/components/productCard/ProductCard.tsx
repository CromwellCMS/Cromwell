import React, { Component, useRef, useEffect, useState } from 'react';
import { TProduct } from '@cromwell/core';
import { Link, getCStore } from '@cromwell/core-frontend';
//@ts-ignore
import styles from './ProductCard.module.scss';
//@ts-ignore
import commonStyles from '../../styles/common.module.scss';
import clsx from 'clsx';
import { IconButton } from '@material-ui/core';
import { AddShoppingCart as AddShoppingCartIcon } from '@material-ui/icons';
import { Rating } from '@material-ui/lab';

export const ProductCard = (props: {
    data?: TProduct, className?: string,
    variant?: 'grid' | 'list'
}) => {
    const data = props.data;
    const productLink = `/product/${data?.slug}`;
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [imageHeigth, setImageHeigth] = useState(300);
    const cstore = getCStore();

    useEffect(() => {
        if (wrapperRef && wrapperRef.current) {
            const width = props.variant !== 'list' ? wrapperRef.current.offsetWidth : wrapperRef.current.offsetHeight;
            setImageHeigth(width);
        }
    }, []);

    return (
        <div className={clsx(styles.Product, commonStyles.onHoverLinkContainer,
            props.className, props.variant === 'list' ? styles.listVariant : undefined)} ref={wrapperRef}>
            <div className={styles.imageBlock} style={{ height: imageHeigth }}>
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
                        onClick={() => {

                        }}
                    >
                        <AddShoppingCartIcon />
                    </IconButton>
                </div>
                <div className={styles.ratingBlock}>
                    <Rating name="read-only" value={data?.rating?.average} precision={0.5} readOnly />
                    {data?.rating?.reviewsNumber && (
                        <p className={styles.ratingCaption}>
                            {data?.rating?.average} based on {data?.rating?.reviewsNumber} reviews.</p>
                    )}
                </div>

            </div>
        </div>
    )
}
