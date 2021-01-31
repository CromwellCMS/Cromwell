import { getCStore, Link, TStoreListItem } from '@cromwell/core-frontend';
import { TProduct } from '@cromwell/core';
import { IconButton } from '@material-ui/core';
import { DeleteForever as DeleteForeverIcon } from '@material-ui/icons';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

import commonStyles from '../../../styles/common.module.scss';
import { LoadBox } from '../../loadbox/Loadbox';
import styles from './CartProductList.module.scss';

export const CartProductList = (props: {
    onProductOpen?: (product: TProduct) => void
}) => {
    const [cart, setCart] = useState<TStoreListItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const cstore = getCStore();

    const handleDeleteItem = (item: TStoreListItem) => {
        cstore.removeFromCart(item);
        setCart(cstore.getCart());
    }

    useEffect(() => {
        /**
         * Since getCart method wll retrieve products from local storage and 
         * after a while products can be modified at the server, we need to refresh cart first  
         */
        (async () => {
            setIsLoading(true);
            await cstore.updateCart();
            const cart = cstore.getCart();
            setCart(cart);
            setIsLoading(false);
        })();
    }, []);

    const cartTotal: number = cart.reduce<number>((prev, current) =>
        prev += (current.product?.price ?? 0) * (current.amount ?? 1), 0);

    const cartTotalOldPrice: number = cart.reduce<number>(
        (prev, current) => prev += (current.product?.oldPrice ?? current.product?.price ?? 0) * (current.amount ?? 1)
        , 0);

    const amount: number = cart.reduce<number>((prev, current) =>
        prev += (current.amount ?? 1), 0);

    return (
        <div className={styles.CartProductList} >
            <div className={styles.cartInfo}>
                <p className={styles.priceBlock} >
                    <span className={styles.cartTotalText}>Cart total:</span>
                    {(cartTotalOldPrice !== cartTotal) && (
                        <span className={styles.oldPrice}>{cstore.getPriceWithCurrency(cartTotalOldPrice)}</span>
                    )}
                    <span className={styles.price}>{cstore.getPriceWithCurrency(cartTotal)}</span>
                </p>
                <p className={styles.itemsText}>Items: {amount}</p>
            </div>
            <div className={styles.productList}>
                {isLoading && (
                    <LoadBox />
                )}
                {!isLoading && cart.map((it, i) => {
                    const product = it.product;
                    const checkedAttrKeys = Object.keys(it.pickedAttributes || {});
                    if (product) {
                        const productLink = `/product/${product.slug}`;
                        return (
                            <div key={i} className={clsx(styles.listItem, commonStyles.onHoverLinkContainer)}>
                                <div className={styles.itemBlock}>
                                    <Link href={productLink}>
                                        <a onClick={() => props?.onProductOpen?.(product)}>
                                            <img src={product.mainImage} className={styles.mainImage} />
                                        </a>
                                    </Link>
                                </div>
                                <div className={styles.itemBlock}>
                                    <Link href={productLink}>
                                        <a onClick={() => props?.onProductOpen?.(product)}
                                            className={clsx(commonStyles.onHoverLink, styles.productName)}>{product.name}</a>
                                    </Link>
                                    <div className={styles.priceBlock}>
                                        {(product?.oldPrice !== undefined && product?.oldPrice !== null) && (
                                            <p className={styles.oldPrice}>{cstore.getPriceWithCurrency(product.oldPrice)}</p>
                                        )}
                                        <p className={styles.price}>{cstore.getPriceWithCurrency(product?.price)}</p>
                                    </div>
                                </div>
                                <div className={styles.itemBlock}>
                                    {checkedAttrKeys.map(key => {
                                        const vals = it.pickedAttributes ? it.pickedAttributes[key] : [];
                                        const valsStr = vals.join(', ');
                                        return <p key={key}>{key}: {valsStr}</p>
                                    })}
                                </div>
                                <div className={styles.itemBlock}>
                                    <p>Qty: {it.amount}</p>
                                </div>
                                <div className={styles.itemBlock} style={{ marginLeft: 'auto', paddingRight: '0px' }}>
                                    <IconButton
                                        aria-label="Delete"
                                        onClick={() => { handleDeleteItem(it); }}
                                    >
                                        <DeleteForeverIcon />
                                    </IconButton>
                                </div>
                            </div>
                        )
                    }
                })}
            </div>
        </div >
    )
}