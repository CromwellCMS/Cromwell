import { TCromwellPage } from '@cromwell/core';
import { CContainer } from '@cromwell/core-frontend';
import React, { useEffect, useRef, useState } from 'react';

import Layout from '../../components/layout/Layout';
import commonStyles from '../../styles/common.module.scss';

const PagesGenericPage: TCromwellPage = (props) => {
    return (
        <Layout>
            <CContainer id="PagesGenericPage" className={commonStyles.content}>

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