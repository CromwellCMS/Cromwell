import { CContainer, CText, useUserInfo } from '@cromwell/core-frontend';
import { MuiAccountInfo, MuiAccountOrders } from '@cromwell/toolkit-commerce';
import { Button } from '@mui/material';
import clsx from 'clsx';
import React from 'react';

import Layout from '../components/layout/Layout';
import { appState } from '../helpers/AppState';
import commonStyles from '../styles/common.module.scss';
import styles from '../styles/pages/account.module.scss';

import type { TPageWithLayout } from './_app';

const Account: TPageWithLayout = () => {
  const userInfo = useUserInfo();

  const handleSignInOpen = () => {
    appState.signInFormType = 'sign-in';
    appState.isSignInOpen = true;
  };

  const handleSignUpOpen = () => {
    appState.signInFormType = 'sign-up';
    appState.isSignInOpen = true;
  };

  return (
    <CContainer className={clsx(commonStyles.content, styles.AccountPage)} id="account_root">
      {userInfo && (
        <>
          <CContainer className={styles.accountContact} id="account_contact">
            <h2 className={styles.subheader}>Contact information</h2>
            <MuiAccountInfo />
          </CContainer>

          <CContainer id="account_orders">
            <h2 className={styles.subheader}>Order history</h2>
            <MuiAccountOrders />
          </CContainer>
        </>
      )}
      {!userInfo && (
        <CContainer style={{ padding: '20px 15px' }} id="account_login">
          <CText className={styles.subheader} id="account_login_text" element="h2">
            Log in
          </CText>
          <CContainer className={styles.signInBlock} id="account_login_btns">
            <Button
              variant="outlined"
              color="primary"
              size="small"
              className={styles.signInBtn}
              onClick={handleSignInOpen}
            >
              Sign in
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              className={styles.signInBtn}
              onClick={handleSignUpOpen}
            >
              Sign up
            </Button>
          </CContainer>
        </CContainer>
      )}
    </CContainer>
  );
};

Account.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};

export default Account;
