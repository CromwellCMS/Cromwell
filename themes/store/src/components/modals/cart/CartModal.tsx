import { Button, IconButton } from '@material-ui/core';
import { ShoppingCart as ShoppingCartIcon, Close as CloseIcon } from '@material-ui/icons';
import { observer } from 'mobx-react';
import React from 'react';
import { Link } from '@cromwell/core-frontend'

import { appState } from '../../../helpers/AppState';
import commonStyles from '../../../styles/common.module.scss';
import { CartProductList } from '../../productList/CartProductList';
import styles from './CartModal.module.scss';
import Modal from '../baseModal/Modal'

export const CartModal = observer(() => {
    const handleCartClose = () => {
        appState.isCartOpen = false;
    }
    return (
        <Modal
            className={commonStyles.center}
            open={appState.isCartOpen}
            onClose={handleCartClose}
            blurSelector={"#CB_root"}
        >
            <div className={styles.cartModal}>
                <IconButton onClick={handleCartClose} className={styles.closeBtn}>
                    <CloseIcon />
                </IconButton>
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