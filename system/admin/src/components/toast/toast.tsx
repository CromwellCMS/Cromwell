import { setStoreItem, TCromwellNotify } from '@cromwell/core';
import { Alert, Box } from '@mui/material';
import React from 'react';
import { toast as toastify, ToastOptions } from 'react-toastify';

import styles from './toast.module.scss';

class Toast implements TCromwellNotify {
  success(text: string, options?: ToastOptions) {
    return toastify.info(
      <div className={styles.container}>
        <Alert
          severity="success"
          className={styles.alert}
          sx={{
            backgroundColor: 'rgba(232, 255, 232, 0.79)',
          }}
        >
          <p>{String(text)}</p>
        </Alert>
      </div>,
      {
        className: styles.toast,
        progressStyle: {
          background: 'rgb(53 122 53 / 20%)',
          height: '3px',
        },
        ...(options ?? {}),
      },
    );
  }

  warning(text: string, options?: ToastOptions) {
    return toastify.info(
      <div className={styles.success}>
        <Alert
          severity="warning"
          className={styles.alert}
          sx={{
            backgroundColor: 'rgba(255, 244, 229, 0.79)',
          }}
        >
          <p>{String(text)}</p>
        </Alert>
      </div>,
      {
        className: styles.toast,
        progressStyle: {
          background: 'rgb(174 131 72 / 19%)',
          height: '3px',
        },
        ...(options ?? {}),
      },
    );
  }

  error(text: string, options?: ToastOptions) {
    return toastify.info(
      <Box>
        <Alert
          severity="error"
          className={styles.alert}
          sx={{
            backgroundColor: 'rgba(255, 234, 234, 0.79)',
          }}
        >
          <p>{String(text)}</p>
        </Alert>
      </Box>,
      {
        className: styles.toast,
        progressStyle: {
          background: 'rgb(192 43 40 / 11%)',
          height: '3px',
        },
        ...(options ?? {}),
      },
    );
  }

  info(text: string, options?: ToastOptions) {
    return toastify.info(
      <div className={styles.success}>
        <Alert
          severity="info"
          className={styles.alert}
          sx={{
            backgroundColor: 'rgba(235, 249, 255, 0.80)',
          }}
        >
          <p>{String(text)}</p>
        </Alert>
      </div>,
      {
        className: styles.toast,
        progressStyle: {
          background: 'rgb(63 148 185 / 27%)',
          height: '3px',
        },
        ...(options ?? {}),
      },
    );
  }

  POSITION = toastify.POSITION;
  warn = this.warning;
  dismiss = toastify.dismiss;
}

export const toast = new Toast();

setStoreItem('notifier', toast);
