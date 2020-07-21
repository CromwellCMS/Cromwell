import React, { Component } from 'react';
import { TProduct } from '@cromwell/core';
import { Link } from '@cromwell/core-frontend';
//@ts-ignore
import styles from './Product.module.scss';
import { IconButton } from '@material-ui/core';
import { AddShoppingCart as AddShoppingCartIcon } from '@material-ui/icons';
import { Rating } from '@material-ui/lab';

export const Product = (props: { data: TProduct }) => {
    const data = props.data;
    const productLink = `/product/${data.slug}`;
    return (
        <div className={styles.Product}>
            <div className={styles.imageBlock}>
                <Link href={productLink}>
                    <a><img className={styles.image} src={data.mainImage} /></a>
                </Link>
            </div>
            <div className={styles.caption}>
                <div>
                    <Link href={productLink}>
                        <a className={styles.productName}>{data.name}</a>
                    </Link>
                </div>
                <div className={styles.priceCartBlock}>
                    <div className={styles.priceBlock}>
                        {data.oldPrice && (
                            <p className={styles.oldPrice}>{data.oldPrice}</p>
                        )}
                        <p className={styles.price}>{data.price}</p>
                    </div>
                    <IconButton
                        aria-label="add to cart"
                        onClick={() => {

                        }}
                    >
                        <AddShoppingCartIcon />
                    </IconButton>
                </div>
                <Rating name="read-only" value={data.rating} precision={0.5} readOnly />
            </div>
        </div>
    )
}
