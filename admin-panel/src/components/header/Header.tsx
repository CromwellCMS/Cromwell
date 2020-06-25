import React from 'react';
import styles from './Header.module.scss';
import { text } from '../../styles/common.module.scss';

export default function Header() {
    return (
        <div className={styles.Header}>
            <p className={text}>Cromwell Admin Panel</p>
        </div>
    )
}
