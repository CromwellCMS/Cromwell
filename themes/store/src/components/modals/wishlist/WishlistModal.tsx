import { MuiWishlist } from '@cromwell/toolkit-commerce';
import { IconButton } from '@mui/material';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import React from 'react';

import { appState } from '../../../helpers/AppState';
import commonStyles from '../../../styles/common.module.scss';
import { CloseIcon } from '../../icons';
import { ProductCard } from '../../productCard/ProductCard';
import Modal from '../baseModal/Modal';
import styles from './WishlistModal.module.scss';

export const WishlistModal = observer(() => {
  const handleClose = () => {
    appState.isWishlistOpen = false;
  }

  return (
    <Modal
      className={clsx(commonStyles.center)}
      open={appState.isWishlistOpen}
      onClose={handleClose}
      blurSelector={"#CB_root"}
    >
      <div className={clsx(styles.wishlistModal)}>
        <IconButton
          aria-label="Close wishlist"
          onClick={handleClose} className={styles.closeBtn}>
          <CloseIcon />
        </IconButton>
        <h3 className={styles.modalTitle}>Wishlist</h3>
        <MuiWishlist elements={{ ProductCard }}
          classes={{ root: styles.list }}
        />
      </div>
    </Modal>
  )
});