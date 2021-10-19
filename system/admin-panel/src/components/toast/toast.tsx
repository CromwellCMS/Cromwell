import { setStoreItem, TCromwellNotify } from '@cromwell/core';
import { Alert } from '@mui/material';
import React from 'react';
import { toast as toastify, ToastOptions } from 'react-toastify';

import styles from './toast.module.scss';

class Toast implements TCromwellNotify {
    success(text: string, options?: ToastOptions) {
        return toastify.info(<div className={styles.container}>
            <Alert severity="success" className={styles.alert}><p>{String(text)}</p></Alert>
        </div>, {
            className: styles.toast,
            ...(options ?? {}),
        })
    }

    warning(text: string, options?: ToastOptions) {
        return toastify.info(<div className={styles.success} >
            <Alert severity="warning" className={styles.alert}><p>{String(text)}</p></Alert>
        </div>, {
            className: styles.toast,
            ...(options ?? {}),
        })
    }

    error(text: string, options?: ToastOptions) {
        return toastify.info(<div className={styles.success}>
            <Alert severity="error" className={styles.alert}><p>{String(text)}</p></Alert>
        </div>, {
            className: styles.toast,
            ...(options ?? {}),
        })
    }

    info(text: string, options?: ToastOptions) {
        return toastify.info(<div className={styles.success}>
            <Alert severity="info" className={styles.alert}><p>{String(text)}</p></Alert>
        </div>, {
            className: styles.toast,
            ...(options ?? {}),
        })
    }

    POSITION = toastify.POSITION;
    warn = this.warning;
    dismiss = toastify.dismiss;
}

export const toast = new Toast();

setStoreItem('notifier', toast);