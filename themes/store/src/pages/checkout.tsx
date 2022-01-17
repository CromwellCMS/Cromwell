import { DefaultCheckoutFields, MuiCartList, MuiCheckout } from '@cromwell/commerce';
import { TOrder, useUserInfo } from '@cromwell/core';
import { CContainer } from '@cromwell/core-frontend';
import { Button } from '@mui/material';
import React, { useState } from 'react';

import Layout from '../components/layout/Layout';
import { appState } from '../helpers/AppState';
import commonStyles from '../styles/common.module.scss';
import styles from '../styles/pages/Checkout.module.scss';

import type { TPageWithLayout } from './_app';

const CheckoutPage: TPageWithLayout = () => {
  const userInfo = useUserInfo();
  const [placedOrder, setPlacedOrder] = useState<TOrder | null | undefined>(null);

  const handleSignInOpen = () => {
    appState.signInFormType = 'sign-in';
    appState.isSignInOpen = true;
  }

  const handleSignUpOpen = () => {
    appState.signInFormType = 'sign-up'
    appState.isSignInOpen = true;
  }

  return (
    <CContainer className={commonStyles.content} id="checkout-1">
      <CContainer className={styles.CheckoutPage} id="checkout-2">
        <CContainer className={styles.inputZone}
          style={{ width: placedOrder ? '100%' : undefined }}
          id="checkout-4"
        >
          <h1 className={styles.pageTitle}>Checkout</h1>
          {!userInfo && !placedOrder && (
            <div className={styles.signInBlock}>
              <Button variant="outlined"
                color="primary"
                size="small"
                className={styles.signInBtn}
                onClick={handleSignInOpen}
              >Sign in</Button>
              <Button variant="outlined"
                color="primary"
                size="small"
                className={styles.signInBtn}
                onClick={handleSignUpOpen}
              >Sign up</Button>
            </div>
          )}
          <CContainer className={styles.checkout} id="checkout-6">
            <MuiCheckout
              onPlaceOrder={(order) => setPlacedOrder(order)}
              fields={[
                {
                  key: DefaultCheckoutFields.customerName,
                  required: true,
                  label: 'Full name',
                },
                {
                  key: DefaultCheckoutFields.customerEmail,
                  required: true,
                  validate: (value) => ({
                    valid: !!value && /\S+@\S+\.\S+/.test(value),
                    message: 'Invalid email',
                  }),
                  label: 'E-mail',
                },
                {
                  key: DefaultCheckoutFields.customerPhone,
                  required: true,
                  label: 'Phone',
                },
                {
                  key: 'Address line 1',
                  required: true,
                  label: 'Address line 1',
                },
                {
                  key: 'Address line 2',
                  label: 'Address line 2',
                },
                {
                  key: 'City',
                  label: 'City',
                },
                {
                  key: 'Country',
                  label: 'Country',
                },
                {
                  key: 'State/Province',
                  label: 'State/Province',
                },
                {
                  key: 'ZIP/Postal code',
                  label: 'ZIP/Postal code',
                },
              ]}
            />
          </CContainer>
        </CContainer>
        <CContainer className={styles.cartZone} id="checkout-5">
          {!placedOrder && (
            <MuiCartList
              sumPosition="none"
              classes={{
                listItem: styles.cartListItem,
                actionsBlock: styles.actionsBlock,
              }}
            />
          )}
        </CContainer>
      </CContainer>
    </CContainer>
  );
}

CheckoutPage.getLayout = (page) => {
  return (
    <Layout>
      {page}
    </Layout >
  )
}

export default CheckoutPage;
