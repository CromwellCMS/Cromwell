import React, { Component, useRef, useEffect, useState } from 'react';
import { TProduct } from '@cromwell/core';
import { Link, getPriceWithCurrency } from '@cromwell/core-frontend';
//@ts-ignore
import styles from './Product.module.scss';
import { IconButton } from '@material-ui/core';
import { AddShoppingCart as AddShoppingCartIcon } from '@material-ui/icons';
import { Rating } from '@material-ui/lab';

export const Product = (props: { data?: TProduct, className?: string }) => {
    const data = props.data;
    const productLink = `/product/${data?.slug}`;
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [imageHeigth, setImageHeigth] = useState(300);

    useEffect(() => {
        if (wrapperRef && wrapperRef.current) {
            const width = wrapperRef.current.offsetWidth;
            setImageHeigth(width);
        }
    }, []);

    return (
        <div className={`${styles.Product} ${props.className}`} ref={wrapperRef}>
            <div className={styles.imageBlock} style={{ height: imageHeigth }}>
                <Link href={productLink}>
                    <a><img className={styles.image} src={data?.mainImage} /></a>
                </Link>
            </div>
            <div className={styles.caption}>
                <div>
                    <Link href={productLink}>
                        <a className={styles.productName}>{data?.name}</a>
                    </Link>
                </div>
                <div className={styles.priceCartBlock}>
                    <div className={styles.priceBlock}>
                        {(data?.oldPrice !== undefined && data?.oldPrice !== null) && (
                            <p className={styles.oldPrice}>{getPriceWithCurrency(data.oldPrice)}</p>
                        )}
                        <p className={styles.price}>{getPriceWithCurrency(data?.price)}</p>
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
                <Rating name="read-only" value={data?.rating} precision={0.5} readOnly />
            </div>
        </div>
    )
}
