import React, { Component } from 'react';
import { TProduct } from '@cromwell/core';
//@ts-ignore
import styles from './Product.module.scss';
// import IconButton from '@material-ui/core/IconButton';
// import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
//@ts-ignore
import Rating from '@material-ui/lab/Rating';

export const Product = (props: { data: TProduct }) => {
    const data = props.data;
    return (
        <div className={styles.Product}>
            <div className={styles.imageBlock}>
                <img className={styles.image} src={data.mainImage} />
            </div>
            <p>{data.name}</p>
            <div className={styles.priceCartBlock}>
                <div className={styles.priceBlock}>
                    {data.oldPrice && (
                        <p className={styles.oldPrice}>{data.oldPrice}</p>
                    )}
                    <p className={styles.price}>{data.price}</p>
                </div>
                {/* <IconButton
                    aria-label="add to cart"
                    onClick={() => {

                    }}
                >
                    <AddShoppingCartIcon />
                </IconButton> */}
            </div>
            <Rating name="read-only" value={data.rating} precision={0.5} readOnly />
        </div>
    )
}
