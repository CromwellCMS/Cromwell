import React from 'react';
import { Button } from '@material-ui/core';
import {
    AddShoppingCart as AddShoppingCartIcon,
    Favorite as FavoriteIcon,
    Equalizer as EqualizerIcon
} from '@material-ui/icons';
//@ts-ignore
import styles from './ProductActions.module.scss';

export const ProductActions = () => {
    return (
        <div className={styles.ProductActions}>
            <Button
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
}
