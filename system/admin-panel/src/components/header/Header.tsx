import React from 'react';
import styles from './Header.module.scss';
import commonStyles from '../../styles/common.module.scss';

export default function Header() {
    return (
        <div className={styles.Header}>
            <p className={commonStyles.text}>Admin Panel</p>
        </div>
    )
}
