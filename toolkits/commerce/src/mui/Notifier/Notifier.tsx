import { Alert } from '@mui/material';
import styles from './Notifier.module.scss';
import React from 'react';

export const NotifierWrapper = (props) => {
  return (
    <div className={styles.notifierContainer}>
      <Alert severity={props.severity} className={styles.notifierAlert}>{props.children}</Alert>
    </div>
  )
}