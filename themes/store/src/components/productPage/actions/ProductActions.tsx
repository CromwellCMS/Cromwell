import { TProduct, TStoreListItem } from '@cromwell/core';
import { getCStore } from '@cromwell/core-frontend';
import { Button, IconButton, Input } from '@material-ui/core';
import {
    Add as AddIcon,
    AddShoppingCart as AddShoppingCartIcon,
    Equalizer as EqualizerIcon,
    Favorite as FavoriteIcon,
    Remove as RemoveIcon,
    ShoppingCart as ShoppingCartIcon,
} from '@material-ui/icons';
import React, { useState } from 'react';

import { productListStore } from '../../../helpers/ProductListStore';
import styles from './ProductActions.module.scss';


function useForceUpdate() {
    const [value, setValue] = useState(0);
    return () => setValue(value => ++value);
}

export const ProductActions = (props: {
    product: TProduct;
    pickedAttributes: Record<string, string[]>;
}) => {
    const forceUpdate = useForceUpdate();
    const [amount, setAmount] = useState(1);
    const { product, pickedAttributes } = props;
    const item: TStoreListItem = {
        product: product ? product : undefined,
        pickedAttributes: pickedAttributes,
        amount
    };
    const cstore = getCStore();
    const inCart = cstore.isInCart(item);
    const sameQntInCart = cstore.hasSameQntInCart(item);
    const inWishlist = cstore.isInWishlist(item);
    const inCompare = cstore.isInCompare(item);

    return (
        <div className={styles.ProductActions}>
            <div className={styles.cartAndAMountBlock}>
                <Button
                    onClick={() => {
                        if (inCart) {
                            if (sameQntInCart) {
                                productListStore.isCartOpen = true;
                            } else {
                                cstore.updateQntInCart(item);
                                forceUpdate();
                            }
                        } else {
                            cstore.addToCart(item);
                            forceUpdate();
                        }
                    }}
                    variant="contained"
                    color="primary"
                    size="large"
                    className={styles.actionButton}
                    startIcon={inCart ? <ShoppingCartIcon /> : <AddShoppingCartIcon />}
                >{inCart ? sameQntInCart ? 'Open cart' : 'Update qty' : 'Add to cart'}</Button>
                <div className={styles.amountPicker}>
                    <Input
                        className={styles.amountInput}
                        value={amount}
                        onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (val && !isNaN(val) && val > 0) setAmount(val)
                        }}
                        startAdornment={
                            <IconButton
                                onClick={() => {
                                    if (amount > 1) {
                                        setAmount(amount - 1)
                                    }
                                }}
                            >
                                <RemoveIcon />
                            </IconButton>
                        }
                        endAdornment={
                            <IconButton
                                onClick={() => {
                                    setAmount(amount + 1)
                                }}
                            >
                                <AddIcon />
                            </IconButton>
                        }
                    />
                </div>
            </div>
            <div>
                <Button
                    onClick={() => {
                        if (inWishlist) {
                            productListStore.isWishlistOpen = true;
                        } else {
                            cstore.addToWishlist(item);
                            forceUpdate();
                        }
                    }}
                    variant="outlined"
                    color="primary"
                    size="large"
                    className={styles.actionButton}
                    startIcon={<FavoriteIcon />}
                >{inWishlist ? 'Open Wishlist' : 'Save'}</Button>
                <Button
                    onClick={() => {
                        if (inCompare) {
                            productListStore.isCompareOpen = true;
                        } else {
                            cstore.addToCompare(item);
                            forceUpdate();
                        }
                    }}
                    variant="outlined"
                    color="primary"
                    size="large"
                    className={styles.actionButton}
                    startIcon={<EqualizerIcon />}
                >{inCompare ? 'Open comparison list' : 'Compare'}</Button>
            </div>

        </div>
    )
}
