import { getAppCustomConfigTextProp, getAppCustomConfigProp } from '@cromwell/core';
import { Link } from '@cromwell/core-frontend';
import React from 'react';

// @ts-ignore
import styles from './Header.module.scss';
// @ts-ignore
import commonStyles from '../../styles/common.module.scss';

type TTopLink = {
    title: string;
    href: string;
}

export default function Header() {
    const topLinks: TTopLink[] | undefined = getAppCustomConfigProp('header/topLinks');
    return (
        <div className={`${styles.Header} ${commonStyles.text}`}>
            <div className={commonStyles.content}>
                <div className={styles.topPanel}>
                    <p>{getAppCustomConfigTextProp('header/welcomeMessage')}</p>
                    <div className={styles.topPanelLinks}>
                        {topLinks && topLinks.map(l => (
                            <div className={styles.topPanelLink}>
                                <Link href={l.href}>{l.title}</Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
