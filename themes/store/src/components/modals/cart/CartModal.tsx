import { Button, Modal } from '@material-ui/core';
import { ShoppingCart as ShoppingCartIcon } from '@material-ui/icons';
import { observer } from 'mobx-react';
import React from 'react';
import { Link } from '@cromwell/core-frontend'

import { productListStore } from '../../../helpers/ProductListStore';
import commonStyles from '../../../styles/common.module.scss';
import { CartProductList } from '../../checkoutPage/productList/CartProductList';
import styles from './CartModal.module.scss';

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
                    <CartProductList onProductOpen={handleCartClose} />
                </div>
                <Link href="/checkout">
                    <a onClick={handleCartClose} style={{ display: 'flex' }}>
                        <Button
                            className={styles.checkoutBtn}
                            variant="contained"
                            color="primary"
                            size="large"
                            startIcon={<ShoppingCartIcon />}
                        >Checkout</Button>
                    </a>
                </Link>
            </div>
        </Modal>
    )
});