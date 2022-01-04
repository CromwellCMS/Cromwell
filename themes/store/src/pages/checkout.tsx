import {
  getRandStr,
  getStoreItem,
  isServer,
  onStoreChange,
  removeOnStoreChange,
  setStoreItem,
  TOrder,
  TPaymentSession,
  TStoreListItem,
  TUser,
} from '@cromwell/core';
import { CContainer, getCStore, getRestApiClient, LoadBox } from '@cromwell/core-frontend';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import GppBadIcon from '@mui/icons-material/GppBad';
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
} from '@mui/material';
import queryString from 'query-string';
import React, { useEffect, useRef, useState } from 'react';

import Layout from '../components/layout/Layout';
import SignInModal, { TFromType } from '../components/modals/signIn/SignIn';
import { CartProductList } from '../components/productList/CartProductList';
import { toast } from '../components/toast/toast';
import { useForceUpdate } from '../helpers/forceUpdate';
import commonStyles from '../styles/common.module.scss';
import styles from '../styles/pages/Checkout.module.scss';

import type { TPageWithLayout } from './_app';

type PaymentStatus = 'cancelled' | 'success';

const CheckoutPage: TPageWithLayout = () => {
  if (!isServer()) {
    // For pop-up payment window after transaction end and redirect with query param
    const parsedUrl = queryString.parseUrl(window.location.href);
    const paymentStatus = parsedUrl.query?.paymentStatus as PaymentStatus;
    if (paymentStatus === 'success') {
      (window.opener as any)?.paySuccess();
      window.close();
    }
    if (paymentStatus === 'cancelled') {
      (window.opener as any)?.payCancel();
      window.close();
    }
  }

  const userInfo = getStoreItem('userInfo');
  const [form, setForm] = useState<{
    email?: string | null;
    name?: string | null;
    phone?: string | null;
    address?: string | null;
    comment?: string | null;
    shippingMethod?: string | null;
    paymentMethod?: string | null;
  }>({
    email: userInfo?.email,
    name: userInfo?.fullName,
    phone: userInfo?.phone,
    address: userInfo?.address,
    paymentMethod: undefined,
    shippingMethod: 'Standard shipping',
  });
  const cstore = getCStore();
  const forceUpdate = useForceUpdate();
  const [singInOpen, setSingInOpen] = useState(false);
  const coupons = useRef<Record<string, {
    value: string;
    applied?: boolean;
  }>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [canValidate, setCanValidate] = useState(false);
  const [singInType, setSingInType] = useState<TFromType>('sign-in');
  const [placedOrder, setPlacedOrder] = useState<TOrder | null>(null);
  const [orderTotal, setOrderTotal] = useState<TPaymentSession | null>(null);

  useEffect(() => {
    const onUserChange = (value: TUser | undefined) => {
      if (value) setForm({
        email: value.email,
        name: value.fullName,
        phone: value.phone,
        address: value.address,
      });
      forceUpdate();
    }

    getOrderTotal();

    cstore.onCartUpdate(getOrderTotal, 'checkout');
    onStoreChange('userInfo', onUserChange);
    onStoreChange('currency', getOrderTotal);

    return () => {
      removeOnStoreChange('userInfo', onUserChange);
      removeOnStoreChange('currency', getOrderTotal);
      cstore.removeOnCartUpdate('checkout');
    }
  }, []);


  const getOrderTotal = async () => {
    setIsLoading(true);
    try {
      const total = await getRestApiClient()?.createPaymentSession({
        cart: JSON.stringify(cstore.getCart()),
        currency: cstore.getActiveCurrencyTag(),
        fromUrl: window.location.origin,
        successUrl: `${window.location.origin}/checkout?paymentStatus=success`,
        cancelUrl: `${window.location.origin}/checkout?paymentStatus=cancelled`,
        couponCodes: Object.values(coupons.current).map(c => c.value).filter(Boolean),
      });
      if (total?.appliedCoupons?.length) {
        for (const couponId of Object.keys(coupons.current)) {
          if (total.appliedCoupons.includes(coupons.current[couponId].value)) {
            coupons.current[couponId].applied = true;
          }
        }
      }
      if (total) setOrderTotal(total);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  }


  const changeForm = (key: keyof typeof form, value: any) => {
    setForm(prevState => {
      return {
        ...prevState,
        [key]: value
      }
    })
  }

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = event.target;
    changeForm(name as any, value);
  }

  const handleSignIn = (user: TUser) => {
    if (user) {
      setStoreItem('userInfo', user);
    }
  }

  const handleSignInOpen = () => {
    setSingInType('sign-in');
    setSingInOpen(true);
  }

  const handleSignUpOpen = () => {
    setSingInType('sign-up');
    setSingInOpen(true);
  }

  const validateOrder = () => {
    if (!canValidate) setCanValidate(true);

    if (!form?.name || !form?.phone || !form?.address || !validateEmail(form.email))
      return false;
    return true;
  }

  const handlePlaceOrder = async () => {
    if (!validateOrder()) {
      toast.warning('Please fill order information');
      document.getElementById('shipping_address_header')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    let order;
    setIsLoading(true);
    try {
      order = await getRestApiClient()?.placeOrder({
        customerName: form.name,
        customerPhone: form.phone,
        customerAddress: form.address,
        customerEmail: form.email,
        customerComment: form.comment,
        userId: userInfo?.id,
        cart: JSON.stringify(cstore.getCart()),
        fromUrl: window.location.origin,
        currency: cstore.getActiveCurrencyTag(),
        shippingMethod: form.shippingMethod,
        paymentMethod: form.paymentMethod,
        couponCodes: Object.values(coupons.current).map(c => c.value).filter(Boolean),
      });
    } catch (e) {
      console.error(e);
      toast.error('Failed to create order');
    }
    setIsLoading(false);

    if (order) {
      setPlacedOrder(order);
      cstore.clearCart();
    }
  }

  const validateEmail = (email) => {
    if (/\S+@\S+\.\S+/.test(email)) {
      return true;
    } else {
      return false;
    }
  }

  const handlePay = async () => {
    if (!validateOrder()) {
      toast.warning('Please fill order information');
      document.getElementById('shipping_address_header')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (!orderTotal?.paymentOptions?.length) {
      toast.warning('No payment options available');
      return;
    }
    if (!form?.paymentMethod) {
      toast.warning('Please choose a payment method');
      return;
    }
    const paymentMethod = orderTotal.paymentOptions.find(option => option.name === form.paymentMethod);
    if (!paymentMethod?.link) {
      toast.warning('Something is wrong with payment method');
      return;
    }

    setIsLoading(true);

    const popup = window.open(paymentMethod.link, 'payment', `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=0,height=0,left=-1000,top=-1000`);

    const success = await new Promise<boolean>(done => {
      (window as any).paySuccess = () => done(true);
      (window as any).payCancel = () => done(false);

      const timer = setInterval(function () {
        if (popup?.closed) {
          clearInterval(timer);
          done(false);
        }
      }, 1000);
    });

    if (success) {
      await handlePlaceOrder();
    }
    setIsLoading(false);
  }

  const wrapContent = (content: JSX.Element | JSX.Element[]) => {
    return (
      <CContainer className={commonStyles.content} id="checkout-1">
        <CContainer className={styles.CheckoutPage} style={{ filter: isLoading ? 'blur(2px)' : 'none' }} id="checkout-2">
          {isLoading && (
            <div className={styles.loadBox}><LoadBox /></div>
          )}
          {content}
        </CContainer>
      </CContainer>
    )
  }

  if (placedOrder) {
    return wrapContent(
      <CContainer className={styles.placedOrderContent} id="checkout-3">
        <Alert severity="success">Your order has been placed! Order ID: {placedOrder?.id}</Alert>
      </CContainer>
    );
  }

  return wrapContent(<>
    <CContainer className={styles.inputZone} id="checkout-4">
      <h1 className={styles.pageTitle}>Checkout</h1>
      {!userInfo && (
        <div className={styles.signInBlock}>
          <Button variant="outlined"
            color="primary"
            size="small"
            className={styles.singinBtn}
            onClick={handleSignInOpen}>
            Sign in</Button>
          <Button variant="outlined"
            color="primary"
            size="small"
            className={styles.singinBtn}
            onClick={handleSignUpOpen}>
            Sign up</Button>
          {singInOpen && (
            <SignInModal
              type={singInType}
              open={singInOpen}
              onClose={() => setSingInOpen(false)}
              onSignIn={handleSignIn}
            />
          )}
        </div>
      )}
      <p></p>
      <div className={styles.delimiter}></div>
      <h2 className={styles.subHeader} id="shipping_address_header">Shipping Address</h2>
      <Tooltip open={canValidate && (!form?.name || form.name == '')} title="This field is required" arrow>
        <TextField label="Name"
          variant="outlined"
          name="name"
          size="small"
          fullWidth
          className={styles.input}
          value={form?.name ?? ''}
          onChange={handleInput}
        />
      </Tooltip>
      <Tooltip open={canValidate && !validateEmail(form?.email)} title="Invalid e-mail" arrow>
        <TextField label="E-mail"
          variant="outlined"
          fullWidth
          name="email"
          size="small"
          className={styles.input}
          value={form?.email ?? ''}
          onChange={handleInput}
          disabled={!!userInfo?.email}
        />
      </Tooltip>
      <Tooltip open={canValidate && (!form?.phone || form.phone == '')} title="This field is required" arrow>
        <TextField label="Phone number"
          variant="outlined"
          name="phone"
          size="small"
          fullWidth
          className={styles.input}
          value={form?.phone ?? ''}
          onChange={handleInput}
        />
      </Tooltip>
      {/* <br className={styles.delimiter} /> */}
      <Tooltip open={canValidate && (!form?.address || form.address == '')} title="This field is required" arrow>
        <TextField label="Address"
          variant="outlined"
          name="address"
          size="small"
          fullWidth
          className={styles.input}
          value={form?.address ?? ''}
          onChange={handleInput}
        />
      </Tooltip>
      <TextField label="Comment"
        variant="outlined"
        name="comment"
        size="small"
        fullWidth
        multiline
        className={styles.input}
        value={form?.comment ?? ''}
        onChange={handleInput} />
      <div className={styles.delimiter}></div>

      <h2 className={styles.subHeader}>Shipping Methods</h2>
      <FormControl component="fieldset" className={styles.shippingMethods}>
        <RadioGroup
          value={form.shippingMethod}
          onChange={(event, value: string) => changeForm('shippingMethod', value)}
        >
          <FormControlLabel value={'Standard shipping'} control={<Radio color="primary" />}
            label={`Standard shipping: ${cstore.getPriceWithCurrency(orderTotal?.shippingPrice)}`} />
        </RadioGroup>
      </FormControl>
      <div className={styles.delimiter}></div>

      <h2 className={styles.subHeader}>Coupons</h2>
      <Button
        sx={{ mb: 1 }}
        variant="outlined"
        onClick={() => {
          coupons.current = { ...coupons.current, [getRandStr(8)]: { value: '' } };
          forceUpdate();
        }}
      >Add coupon</Button>
      {Object.entries(coupons.current).map(([couponId, coupon]) => {
        return (
          <Box sx={{ my: 2, display: 'flex', alignItems: 'center' }} key={couponId} >
            {!isLoading && coupon.applied === true && (
              <CheckCircleOutlineIcon sx={{ mr: 1, color: '#357a38' }} />
            )}
            {!isLoading && coupon.applied === false && (
              <GppBadIcon sx={{ mr: 1, color: '#b2102f' }} />
            )}
            <TextField
              id={couponId}
              fullWidth
              size="small"
            />
            <Button
              style={{ margin: '-1px 0px 0 -4px', height: '41px' }}
              variant="contained"
              onClick={() => {
                coupons.current = {
                  ...coupons.current,
                  [couponId]: {
                    value: (document.getElementById(couponId) as HTMLInputElement)?.value,
                    applied: false,
                  }
                }
                getOrderTotal();
              }}
            >Apply</Button>
            <IconButton
              sx={{ ml: 1 }}
              onClick={() => {
                if (coupons.current[couponId].applied) {
                  setTimeout(getOrderTotal, 50);
                }
                delete coupons.current[couponId];
                forceUpdate();
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        )
      })}
      <div className={styles.delimiter}></div>

      <h2 className={styles.subHeader}>Order details</h2>
      {!!(orderTotal?.cartTotalPrice && orderTotal?.cartOldTotalPrice &&
        orderTotal.cartTotalPrice !== orderTotal.cartOldTotalPrice) && (
          <div className={styles.detailsRow}>
            <p style={{ color: '#999' }}>Cart total without discount: </p>
            <p style={{ color: '#999', textDecoration: 'line-through' }}>{cstore.getPriceWithCurrency(orderTotal.cartOldTotalPrice)}</p>
          </div>
        )}
      <div className={styles.detailsRow}>
        <p>Cart total: </p>
        <b>{cstore.getPriceWithCurrency(orderTotal?.cartTotalPrice)}</b>
      </div>
      <div className={styles.detailsRow}>
        <p>Shipping:</p>
        <b>{cstore.getPriceWithCurrency(orderTotal?.shippingPrice)}</b>
      </div>
      <div className={styles.detailsRow}>
        <p className={styles.totalText}>Total:</p>
        <b className={styles.totalText}>{cstore.getPriceWithCurrency(orderTotal?.orderTotalPrice)}</b>
      </div>

      <h2 className={styles.subHeader} style={{ marginTop: '50px' }}>Payment Methods</h2>
      <FormControl component="fieldset" className={styles.shippingMethods}>
        <RadioGroup
          value={form.paymentMethod}
          onChange={(event, value: string) => changeForm('paymentMethod', value)}
        >
          {orderTotal?.paymentOptions?.map(option => {
            if (!option?.link || !option.name) return <></>;
            return (
              <FormControlLabel
                key={option.name}
                value={option.name}
                control={<Radio color="primary" />}
                label={option.name}
              />
            )
          })}
          <FormControlLabel value={'later'} control={<Radio color="primary" />}
            label="Pay later" />
        </RadioGroup>
      </FormControl>

      {form.paymentMethod === 'later' && (
        <div className={styles.orderBtnWrapper}>
          <Button variant="contained"
            color="primary"
            className={styles.singinBtn}
            size="large"
            onClick={handlePlaceOrder}
            disabled={isLoading}
          >Place order</Button>
        </div>
      )}
      {form.paymentMethod && form.paymentMethod !== 'later' && (
        <div className={styles.orderBtnWrapper}>
          <Button variant="contained"
            color="primary"
            className={styles.singinBtn}
            size="large"
            onClick={handlePay}
            disabled={isLoading}
          >Pay</Button>
        </div>
      )}
    </CContainer>
    <CContainer className={styles.cartZone} id="checkout-5">
      <CartProductList collapsedByDefault={false} cart={orderTotal?.cart as TStoreListItem[]} />
    </CContainer>
  </>);
}

CheckoutPage.getLayout = (page) => {
  return (
    <Layout>
      {page}
    </Layout >
  )
}

export default CheckoutPage;
