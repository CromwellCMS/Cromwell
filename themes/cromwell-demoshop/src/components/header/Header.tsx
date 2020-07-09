import { getAppCustomConfigTextProp } from '@cromwell/core';
import React from 'react';

// @ts-ignore
import styles from './Header.module.scss';

export default function Header() {
    return (
        <div className={styles.Header}>
            <div className={styles.topPanel}>
                <p>{getAppCustomConfigTextProp('header/welcomeMessage')}</p>
            </div>
        </div>
    )
}
