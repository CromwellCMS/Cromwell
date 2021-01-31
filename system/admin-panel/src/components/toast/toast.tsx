
import React from "react";
import { setStoreItem, TCromwellNotify } from '@cromwell/core';
import { toast as toastify } from "react-toastify";
import {
    CheckCircleOutline as CheckCircleOutlineIcon,
    Delete as DeleteIcon,
    LibraryAdd as LibraryAddIcon,
    Settings as SettingsIcon,
    Error as ErrorIcon,
    Warning as WarningIcon,
} from '@material-ui/icons';
import styles from './toast.module.scss';

export const toast: TCromwellNotify = {
    success: (text: string) => {
        toastify.success(<div className={styles.success}>
            <CheckCircleOutlineIcon style={{ marginRight: '5px' }} />
            <p>{text}</p>
        </div>)
    },
    warning: (text: string) => {
        toastify.success(<div className={styles.success}>
            <WarningIcon style={{ marginRight: '5px' }} />
            <p>{text}</p>
        </div>)
    },
    error: (text: string) => {
        toastify.success(<div className={styles.success}>
            <ErrorIcon style={{ marginRight: '5px' }} />
            <p>{text}</p>
        </div>)
    },
}

setStoreItem('notifier', toast);