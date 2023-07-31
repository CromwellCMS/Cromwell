import { TGetStaticProps } from '@cromwell/core';
import { CContainer } from '@cromwell/core-frontend';
import React from 'react';

import Layout from '../../components/layout/Layout';
import commonStyles from '../../styles/common.module.scss';
import styles from '../../styles/pages/Pages.module.scss';

import type { TPageWithLayout } from '../_app';

const GenericPage: TPageWithLayout = () => {
  return (
    <CContainer className={styles.Pages} id="PagesGenericPage">
      <CContainer id="PagesGenericPage_content" className={commonStyles.content}></CContainer>
    </CContainer>
  );
};

GenericPage.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};

export default GenericPage;

export const getStaticProps: TGetStaticProps = async (context) => {
  if (!context.pageConfig?.id || !context.pageConfig.route)
    return {
      notFound: true,
    };
  return {
    props: {},
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};
