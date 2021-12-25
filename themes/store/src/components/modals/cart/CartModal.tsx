import { Link } from '@cromwell/core-frontend';
import { Button, IconButton } from '@mui/material';
import { observer } from 'mobx-react';
import React from 'react';

import { appState } from '../../../helpers/AppState';
import commonStyles from '../../../styles/common.module.scss';
import { CloseIcon, ShoppingCartIcon } from '../../icons';
import { CartProductList } from '../../productList/CartProductList';
import Modal from '../baseModal/Modal';
import styles from './CartModal.module.scss';

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
                <IconButton
                    aria-label="Close shopping cart"
                    onClick={handleCartClose} className={styles.closeBtn}>
                    <CloseIcon />
                </IconButton>
                <div className={styles.cartList}>
                    <CartProductList onProductOpen={handleCartClose} />
                </div>
                <Link href="/checkout" onClick={handleCartClose} style={{ display: 'flex' }}>
                    <Button
                        aria-label={"Open checkout"}
                        className={styles.checkoutBtn}
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={<ShoppingCartIcon />}
                    >Checkout</Button>
                </Link>
            </div>
        </Modal>
    )
});