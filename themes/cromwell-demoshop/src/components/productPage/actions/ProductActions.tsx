import React, { useState } from 'react';
import { Button, TextField, IconButton } from '@material-ui/core';
import {
    AddShoppingCart as AddShoppingCartIcon,
    ShoppingCart as ShoppingCartIcon,
    Favorite as FavoriteIcon,
    Equalizer as EqualizerIcon,
    Remove as RemoveIcon,
    Add as AddIcon
} from '@material-ui/icons';
import { toast } from 'react-toastify';
import { productListStore, TProductListItem } from '../../../helpers/ProductListStore';
//@ts-ignore
import styles from './ProductActions.module.scss';
import { isServer, TProduct, TAttributeInstance } from '@cromwell/core';
import { isInCart, isInWishlist, isInCompare, addToCart, addToWishlist, addToCompare } from '@cromwell/core-frontend';


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
    const item: TProductListItem = {
        product: product ? product : undefined,
        pickedAttributes: pickedAttributes,
        amount
    };
    const inCart = isInCart(item);
    const inWishlist = isInWishlist(item);
    const inCompare = isInCompare(item);

    return (
        <div className={styles.ProductActions}>
            <div className={styles.cartAndAMountBlock}>
                <Button
                    onClick={() => {
                        if (inCart) {
                            productListStore.isCartOpen = true;
                        } else {
                            addToCart(item);
                            forceUpdate();
                        }
                    }}
                    variant="contained"
                    color="primary"
                    size="large"
                    className={styles.actionButton}
                    startIcon={inCart ? <ShoppingCartIcon /> : <AddShoppingCartIcon />}
                >{inCart ? 'Open cart' : 'Add to cart'}</Button>
                <div className={styles.amountPicker}>
                    <IconButton
                        onClick={() => {
                            if (amount > 1) {
                                setAmount(amount - 1)
                            }
                        }}
                    >
                        <RemoveIcon />
                    </IconButton>
                    <TextField
                        type="number"
                        className={styles.amountInput}
                        value={amount}
                        onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (val && val > 0) setAmount(val)
                            else setAmount(1)
                        }}
                    />
                    <IconButton
                        onClick={() => {
                            setAmount(amount + 1)
                        }}
                    >
                        <AddIcon />
                    </IconButton>
                </div>
            </div>

            <div>
                <Button
                    onClick={() => {
                        if (inWishlist) {
                            productListStore.isWishlistOpen = true;
                        } else {
                            addToWishlist(item);
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
                        if (inWishlist) {
                            productListStore.isCompareOpen = true;
                        } else {
                            addToCompare(item);
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
