import { TCromwellNotify } from '@cromwell/core';
import { setNotifier } from '@cromwell/toolkit-commerce';
import { Alert } from '@mui/material';
import React from 'react';
import { toast as toastify, ToastOptions } from 'react-toastify';

import styles from './toast.module.scss';

class Toast implements TCromwellNotify {
  success(text: string, options?: ToastOptions) {
    toastify.success(
      <div className={styles.container}>
        <Alert severity="success" className={styles.alert}>
          {text}
        </Alert>
      </div>,
      {
        ...(options ?? {}),
        className: styles.toast,
      },
    );
  }
  warning(text: string, options?: ToastOptions) {
    toastify.warn(
      <div className={styles.success}>
        <Alert severity="warning" className={styles.alert}>
          {text}
        </Alert>
      </div>,
      {
        ...(options ?? {}),
        className: styles.toast,
      },
    );
  }
  error(text: string, options?: ToastOptions) {
    toastify.error(
      <div className={styles.success}>
        <Alert severity="error" className={styles.alert}>
          {text}
        </Alert>
      </div>,
      {
        ...(options ?? {}),
        className: styles.toast,
      },
    );
  }
  info(text: string, options?: ToastOptions) {
    toastify.info(
      <div className={styles.success}>
        <Alert severity="info" className={styles.alert}>
          {text}
        </Alert>
      </div>,
      {
        ...(options ?? {}),
        className: styles.toast,
      },
    );
  }

  POSITION = toastify.POSITION;
  warn = this.warning;
}

export const toast = new Toast();

setNotifier(toast);
