import { CContainer, CText } from '@cromwell/core-frontend';
import React from 'react';

import Layout from '../components/layout/Layout';
import styles from '../styles/common.module.scss';

import type { TPageWithLayout } from './_app';

const Custom404: TPageWithLayout = () => {
    return (
        <CContainer className={styles.content} id="404-1">
            <CContainer className={styles.notFound} id="404-2">
                <CText element="h1" id="404-4">404 - Page Not Found</CText>
            </CContainer>
        </CContainer>
    );
}

Custom404.getLayout = (page) => {
    return (
        <Layout>
            {page}
        </Layout >
    )
}

export default Custom404;