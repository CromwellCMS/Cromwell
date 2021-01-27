
import React from "react";
import { setStoreItem } from '@cromwell/core';
import { toast as toastify } from "react-toastify";
import {
    CheckCircleOutline as CheckCircleOutlineIcon,
    Delete as DeleteIcon,
    LibraryAdd as LibraryAddIcon,
    Settings as SettingsIcon,
} from '@material-ui/icons';
import styles from './toast.module.scss';

export const toast = {
    success: (text: string) => {
        toastify.success(<div className={styles.success}>
            <CheckCircleOutlineIcon style={{ marginRight: '5px' }} />
            <p>{text}</p>
        </div>)
    }
}

setStoreItem('notifier', toast);