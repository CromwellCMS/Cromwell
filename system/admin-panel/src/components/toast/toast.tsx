import { setStoreItem, TCromwellNotify } from '@cromwell/core';
import {
    CheckCircleOutline as CheckCircleOutlineIcon,
    Error as ErrorIcon,
    Warning as WarningIcon,
} from '@material-ui/icons';
import React from 'react';
import { toast as toastify, ToastOptions } from 'react-toastify';

import styles from './toast.module.scss';


export const toast: TCromwellNotify = {
    success: (text: string, options?: ToastOptions) => {
        toastify.success(<div className={styles.success}>
            <CheckCircleOutlineIcon style={{ marginRight: '5px' }} />
            <p>{text}</p>
        </div>, options)
    },
    warning: (text: string, options?: ToastOptions) => {
        toastify.success(<div className={styles.success}>
            <WarningIcon style={{ marginRight: '5px' }} />
            <p>{text}</p>
        </div>, options)
    },
    error: (text: string, options?: ToastOptions) => {
        toastify.success(<div className={styles.success}>
            <ErrorIcon style={{ marginRight: '5px' }} />
            <p>{text}</p>
        </div>, options)
    },
}

setStoreItem('notifier', toast);