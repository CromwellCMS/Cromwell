import React from 'react';

import styles from '../styles/common.module.scss';
import Layout from '../components/layout/Layout';


const Custom404 = () => {
    return (
        <Layout>
            <div className={styles.content}>
                <div className={styles.notFound}>
                    <h1>404 - Page Not Found</h1>
                </div>
            </div>
        </Layout>
    );
}

export default Custom404;