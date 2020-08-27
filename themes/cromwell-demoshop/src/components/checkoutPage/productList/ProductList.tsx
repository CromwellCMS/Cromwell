import { getCart, getGraphQLClient, getPriceWithCurrency, removeFromCart, updateCart } from '@cromwell/core-frontend';
import { IconButton } from '@material-ui/core';
import { DeleteForever as DeleteForeverIcon } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';

import { TProductListItem } from '../../../helpers/ProductListStore';
import { LoadBox } from '../../loadbox/Loadbox';
//@ts-ignore
import styles from './ProductList.module.scss';

const ProductList = () => {
    const [cart, setCart] = useState<TProductListItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const client = getGraphQLClient();

    const handleDeleteItem = (item: TProductListItem) => {
        removeFromCart(item);
        setCart(getCart());
    }

    useEffect(() => {
        /**
         * Since getCart wll retrieve products from local storage and 
         * after a while  products can be modified at the server
         * we need to refresh the cart first  
         */
        (async () => {
            setIsLoading(true);
            await updateCart();
            const cart = getCart();
            setCart(cart);
            setIsLoading(false);
        })();
    }, []);

    return (
        <div className={styles.ProductList}>
            {isLoading && (
                <LoadBox />
            )}
            {!isLoading && cart.map((it, i) => {
                const product = it.product;
                const checkedAttrKeys = Object.keys(it.pickedAttributes || {});
                if (product)
                    return (
                        <div key={i} className={styles.listItem}>
                            <div className={styles.itemBlock}>
                                <img src={product.mainImage} className={styles.mainImage} />
                            </div>
                            <div className={styles.itemBlock}>
                                <p>{product.name}</p>
                                <div className={styles.priceBlock}>
                                    {(product?.oldPrice !== undefined && product?.oldPrice !== null) && (
                                        <p className={styles.oldPrice}>{getPriceWithCurrency(product.oldPrice)}</p>
                                    )}
                                    <p className={styles.price}>{getPriceWithCurrency(product?.price)}</p>
                                </div>
                            </div>
                            <div className={styles.itemBlock}>
                                {checkedAttrKeys.map(key => {
                                    const vals = it.pickedAttributes ? it.pickedAttributes[key] : [];
                                    const valsStr = vals.join(', ');
                                    return <p key={key}>{key}: {valsStr}</p>
                                })}
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
            })}
        </div>
    )
}

export default ProductList;