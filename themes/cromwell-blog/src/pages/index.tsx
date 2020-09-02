import React from 'react';
import { TCromwellPage } from '@cromwell/core';
import Layout from '../components/layout/Layout';
// @ts-ignore
import styles from '../styles/pages/Index.module.scss';

const Index: TCromwellPage = (props) => {
    console.log('IndexTheme props', props);

    return (
        <Layout>
            <div className={styles.IndexPage}>
                <p>Index. Demo Blog</p>
            </div>
        </Layout>
    );
}
export default Index;