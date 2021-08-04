import { TCromwellPage } from '@cromwell/core';
import { CContainer } from '@cromwell/core-frontend';
import React from 'react';

import Layout from '../../components/layout/Layout';
import commonStyles from '../../styles/common.module.scss';
import styles from '../../styles/pages/Pages.module.scss';


const PagesGenericPage: TCromwellPage = () => {
    return (
        <Layout>
            <CContainer className={styles.Pages} id="PagesGenericPage">
                <CContainer id="PagesGenericPage_content" className={commonStyles.content}>

                </CContainer>
            </CContainer>
        </Layout>
    );
}

export default PagesGenericPage;


export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: true
    };
}