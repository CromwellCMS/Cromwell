import { MuiViewedItems } from '@cromwell/commerce';
import { IconButton } from '@mui/material';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import React from 'react';

import { appState } from '../../../helpers/AppState';
import { ProductCard } from '../../productCard/ProductCard';
import commonStyles from '../../../styles/common.module.scss';
import { CloseIcon } from '../../icons';
import Modal from '../baseModal/Modal';
import styles from './ViewedModal.module.scss';

export const ViewedModal = observer(() => {
  const handleClose = () => {
    appState.isWatchedOpen = false;
  }

  return (
    <Modal className={clsx(commonStyles.center)}
      open={appState.isWatchedOpen}
      onClose={handleClose}
      blurSelector={"#CB_root"}
    >
      <div className={clsx(styles.ViewedModal)}>
        <IconButton
          aria-label="Close recently viewed items"
          onClick={handleClose} className={styles.closeBtn}>
          <CloseIcon />
        </IconButton>
        <h3 className={styles.modalTitle}>Viewed Items</h3>
        <MuiViewedItems elements={{ ProductCard }}
          classes={{ root: styles.list }}
        />
      </div>
    </Modal>
  )
});