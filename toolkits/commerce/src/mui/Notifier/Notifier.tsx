import { Alert } from '@mui/material';
import React from 'react';
import { toast as toastify } from 'react-toastify';

import styles from './Notifier.module.scss';
import { Notifier } from '../../helpers/notifier';

/** @internal */
export const NotifierWrapper = (props) => {
  return (
    <div className={styles.notifierContainer}>
      <Alert severity={props.severity} className={styles.notifierAlert}>
        {props.children}
      </Alert>
    </div>
  );
};

export const muiNotifier = new Notifier({
  position: toastify.POSITION.TOP_RIGHT,
  className: styles.muiToast,
  Wrapper: NotifierWrapper,
});
