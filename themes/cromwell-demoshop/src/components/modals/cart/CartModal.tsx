import React from 'react';
import {
    Modal,
    Button
} from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon, ShoppingCart as ShoppingCartIcon } from '@material-ui/icons';
import { productListStore } from '../../../helpers/ProductListStore';
import { CartProductList } from '../../checkoutPage/productList/CartProductList';
import { observer } from "mobx-react";
// @ts-ignore
import commonStyles from '../../../styles/common.module.scss';
// @ts-ignore
import styles from './CartModal.module.scss'

export const CartModal = observer(() => {
    const handleCartClose = () => {
        productListStore.isCartOpen = false;
    }
    return (
        <Modal
            className={commonStyles.center}
            open={productListStore.isCartOpen}
            onClose={handleCartClose}
        >
            <div className={styles.cartModal}>
                <div className={styles.cartList}>
                    <CartProductList />
                </div>
                <Button
                    className={styles.checkoutBtn}
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<ShoppingCartIcon />}
                >Checkout</Button>
            </div>
        </Modal>
    )
});