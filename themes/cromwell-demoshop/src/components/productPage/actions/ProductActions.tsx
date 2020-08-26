import React from 'react';
import { Button } from '@material-ui/core';
import {
    AddShoppingCart as AddShoppingCartIcon,
    Favorite as FavoriteIcon,
    Equalizer as EqualizerIcon
} from '@material-ui/icons';
import { toast } from 'react-toastify';
import * as actions from '../../../helpers/productActions';
import { productStore } from '../../../helpers/ProductPageStore';
//@ts-ignore
import styles from './ProductActions.module.scss';
import { isServer, TProduct, TAttributeInstance } from '@cromwell/core';
import { observer } from "mobx-react";
import { toJS } from "mobx";



if (!isServer()) {
    (window as any).prodActions = actions;
}

export const ProductActions = observer(() => {
    const { product, pickedAttributes } = productStore;
    return (
        <div className={styles.ProductActions}>
            <Button
                onClick={() => {
                    if (product) {
                        const hasBeenAdded = actions.addToCart({
                            product: toJS(product),
                            pickedAttributes: toJS(pickedAttributes),
                            amount: 1
                        });

                    }

                }}
                variant="contained"
                color="primary"
                size="large"
                className={styles.actionButton}
                startIcon={<AddShoppingCartIcon />}
            >Add to cart</Button>
            <div>
                <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    className={styles.actionButton}
                    startIcon={<FavoriteIcon />}
                >Save</Button>
                <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    className={styles.actionButton}
                    startIcon={<EqualizerIcon />}
                >Compare</Button>
            </div>

        </div>
    )
})
