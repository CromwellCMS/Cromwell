import React, { useState, useEffect } from 'react';
import styles from './404page.module.scss';

export default function Page404() {
    const [canShowText, setCanShowText] = useState(false);
    useEffect(() => {
        const id = setTimeout(() => setCanShowText(true), 1000);
        return () => {
            clearTimeout(id);
        }
    }, []);
    return (
        <div className={styles.Page404}>
            {canShowText && (
                <p>404. Page not found</p>
            )}
        </div>
    );
}