import {
  isServer,
  onStoreChange,
  payLaterOption as defaultPayLaterOption,
  removeOnStoreChange,
  standardShipping as defaultStandardShipping,
  TOrder,
  TOrderInput,
  TOrderPaymentSession,
  TPaymentOption,
  TShippingOption,
  TUser,
} from '@cromwell/core';
import { getCStore, getRestApiClient, useUserInfo } from '@cromwell/core-frontend';
import queryString from 'query-string';
import React, { useEffect, useRef, useState } from 'react';

import { getNotifier } from '../../helpers/notifier';
import { moduleState } from '../../helpers/state';
import { CheckoutProps } from './Checkout';
import { DefaultCheckoutFields, getDefaultCheckoutFields } from './DefaultElements';

/** @internal */
export type PaymentStatus = 'cancelled' | 'success';

/** @internal */
export const usuCheckoutActions = (config: {
  checkoutProps: CheckoutProps;
  rootRef: React.MutableRefObject<HTMLDivElement | null>;
}) => {
  const cstore = getCStore();
  const {
    notifier = getNotifier(),
    notifierOptions = {},
    fields = getDefaultCheckoutFields(config.checkoutProps),
    text,
    getPaymentOptions,
    changeErrorText,
  } = config.checkoutProps;

  const [isLoading, setIsLoading] = useState(false);
  const [isAwaitingPayment, setIsAwaitingPayment] = useState(false);
  const userInfo = useUserInfo();
  const [canShowValidation, setCanShowValidation] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<TOrder | null>(null);
  const [paymentSession, setPaymentSession] = useState<TOrderPaymentSession | null | undefined>(null);
  const [additionalPaymentOptions, setAdditionalPaymentOptions] = useState<TPaymentOption[] | null>(null);

  const standardShipping: TShippingOption = {
    key: defaultStandardShipping.key,
    name: text?.standardShipping ?? defaultStandardShipping.name,
  };
  const payLaterOption: TPaymentOption = {
    key: defaultPayLaterOption.key,
    name: text?.payLater ?? defaultPayLaterOption.name,
  };

  const [order, setOrder] = useState<TOrderInput>({
    customerEmail: userInfo?.email,
    customerName: userInfo?.fullName,
    customerPhone: userInfo?.phone,
    customerAddress: userInfo?.address,
    paymentMethod: undefined,
    shippingMethod: standardShipping.key,
  });

  const coupons = useRef<
    Record<
      string,
      {
        value: string;
        applied?: boolean | null;
      }
    >
  >({});

  useEffect(() => {
    if (!isServer()) {
      // For pop-up payment window after transaction end and redirect with query param.
      // ***
      // When we call `client.createPaymentSession` we pass `successUrl` and `cancelUrl`.
      // Customer will be redirected on these URLs when transaction is finished.
      // In this case we point `successUrl` to the same (this) page with a query param;
      // So if URL has params, then we can communicate with parent page (where transaction started)
      // and tell transaction status:
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

    const onUserChange = (value: TUser | undefined) => {
      if (value)
        setOrder((prev) => ({
          ...prev,
          customerEmail: value.email,
          customerName: value.fullName,
          customerPhone: value.phone,
          customerAddress: value.address,
        }));
    };

    checkout.getOrderTotal();

    const cartUpdateCbId = cstore.onCartUpdate(checkout.getOrderTotal);
    const userInfoCbId = onStoreChange('userInfo', onUserChange);
    const currencyCbId = onStoreChange('currency', checkout.getOrderTotal);

    return () => {
      removeOnStoreChange('userInfo', userInfoCbId);
      removeOnStoreChange('currency', currencyCbId);
      cstore.removeOnCartUpdate(cartUpdateCbId);
      moduleState.setPaymentSession(null);
    };
  }, []);

  const checkout = {
    order,
    setOrder,
    isLoading,
    isAwaitingPayment,
    placedOrder,
    paymentSession,
    coupons: coupons.current,
    canShowValidation,
    additionalPaymentOptions,
    payLaterOption,
    standardShipping,
    setCoupons: (newCoupons) => {
      coupons.current = newCoupons;
    },
    getOrderTotal: async () => {
      setIsLoading(true);
      try {
        const successUrl = queryString.parseUrl(window.location.href);
        successUrl.query.paymentStatus = 'success';

        const cancelUrl = queryString.parseUrl(window.location.href);
        cancelUrl.query.paymentStatus = 'cancelled';

        const session =
          (await getRestApiClient()
            .createPaymentSession({
              cart: JSON.stringify(cstore.getCart()),
              currency: cstore.getActiveCurrencyTag(),
              fromUrl: window.location.origin,
              successUrl: queryString.stringifyUrl(successUrl),
              cancelUrl: queryString.stringifyUrl(cancelUrl),
              couponCodes: Object.values(coupons.current)
                .map((c) => c.value)
                .filter(Boolean),
              shippingMethod: order.shippingMethod,
              paymentSessionId: paymentSession?.paymentSessionId,
            })
            ?.catch((e) => console.error(e))) || null;

        for (const couponId of Object.keys(coupons.current)) {
          if (session?.appliedCoupons?.includes(coupons.current[couponId].value)) {
            coupons.current[couponId].applied = true;
          } else {
            coupons.current[couponId].applied = false;
          }
        }

        setPaymentSession(session);
        moduleState.setPaymentSession(session);
        config.checkoutProps.onGetOrderTotal?.(session);

        if (getPaymentOptions) {
          try {
            const additional = await getPaymentOptions(session);
            if (additional) setAdditionalPaymentOptions(additional.filter(Boolean));
          } catch (error) {
            console.error(error);
          }
        }
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    },

    placeOrder: async () => {
      if (!canShowValidation) setCanShowValidation(true);
      if (!checkout.isOrderValid()) {
        notifier?.warning?.(text?.fillOrderInformation ?? 'Please fill order information', { ...notifierOptions });
        config.rootRef?.current?.scrollIntoView?.({ behavior: 'smooth' });
        return;
      }

      setIsLoading(true);
      const placedOrder =
        (await getRestApiClient()
          ?.placeOrder(
            Object.assign({}, order, {
              userId: userInfo?.id,
              cart: JSON.stringify(cstore.getCart()),
              fromUrl: window.location.origin,
              currency: cstore.getActiveCurrencyTag(),
              couponCodes: Object.values(coupons.current)
                .map((c) => c.value)
                .filter(Boolean),
            }),
          )
          .catch((e) => {
            console.error(e);
            notifier?.error?.(
              (text?.failedCreateOrder ?? 'Failed to place order.') + ' ' + (changeErrorText ?? ((m) => m))(e.message),
              { ...notifierOptions },
            );
          })) || null;

      setIsLoading(false);
      config.checkoutProps.onPlaceOrder?.(placedOrder);

      if (placedOrder) {
        setPlacedOrder(placedOrder);
        moduleState.setPaymentSession(null);
        cstore.clearCart();
      }
    },

    changeOrder: (key: keyof TOrder, value: any) => {
      setOrder((prevState) => {
        return {
          ...prevState,
          [key]: value,
        };
      });
    },

    getFieldValue: (fieldKey): string | null => {
      const field = fields.find((f) => f.key === fieldKey);
      if (!field) return null;
      const isDefault = Object.values<string>(DefaultCheckoutFields).includes(fieldKey);
      let value;

      if (!isDefault) {
        let address;
        try {
          address = JSON.parse(order.customerAddress ?? '{}');
        } catch (e) {}
        if (address) {
          value = address[field.key];
        }
      } else if (field.meta) {
        value = order.customMeta?.[field.key];
      } else {
        value = order[field.key];
      }
      return value ?? null;
    },

    setFieldValue: (fieldKey, newValue: string) => {
      const field = fields.find((f) => f.key === fieldKey);
      if (!field) return null;
      const isDefault = Object.values<string>(DefaultCheckoutFields).includes(fieldKey);

      if (isDefault) {
        checkout.changeOrder(field.key as any, newValue);
      } else if (field.meta) {
        checkout.changeOrder('customMeta', {
          ...order.customMeta,
          [field.key]: newValue,
        });
      } else {
        let address;
        try {
          address = JSON.parse(order.customerAddress ?? '{}');
        } catch (e) {}
        if (typeof address !== 'object') address = {};
        address[field.key] = newValue;
        checkout.changeOrder('customerAddress', JSON.stringify(address));
      }
    },

    isFieldValid: (
      fieldKey,
    ): {
      valid: boolean;
      message?: string;
    } => {
      const field = fields.find((f) => f.key === fieldKey);
      if (!field)
        return {
          valid: false,
          message: 'Wrong field config',
        };

      const value = checkout.getFieldValue(fieldKey);
      if (field.required && !value)
        return {
          valid: false,
          message: text?.fieldIsRequired ?? 'This field is required',
        };
      if (field.validate) return field.validate(value);
      return {
        valid: true,
      };
    },

    isOrderValid: () => {
      for (const field of fields) {
        if (!checkout.isFieldValid(field.key).valid) return false;
      }
      return true;
    },

    pay: async () => {
      if (!canShowValidation) setCanShowValidation(true);
      if (!checkout.isOrderValid()) {
        notifier?.warning?.(text?.fillOrderInformation ?? 'Please fill order information', { ...notifierOptions });
        config.rootRef?.current?.scrollIntoView?.({ behavior: 'smooth' });
        return;
      }
      if (!paymentSession?.paymentOptions?.length) {
        notifier?.warning?.(text?.noPaymentsAvailable ?? 'No payment options available', { ...notifierOptions });
        return;
      }
      if (!order?.paymentMethod) {
        notifier?.warning?.(text?.choosePaymentMethod ?? 'Please choose a payment method', { ...notifierOptions });
        return;
      }
      const paymentMethod = paymentSession.paymentOptions.find((option) => option.name === order.paymentMethod);
      if (!paymentMethod?.link) {
        console.error('Cannot proceed payment. paymentMethod.link is not set: ' + paymentMethod);
        notifier?.warning?.(text?.somethingWrongWithPayment ?? 'Something is wrong with payment method', {
          ...notifierOptions,
        });
        return;
      }

      setIsAwaitingPayment(true);

      const popup = window.open(
        paymentMethod.link,
        'payment',
        `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=0,height=0,left=-1000,top=-1000`,
      );

      const success = await new Promise<boolean>((done) => {
        (window as any).paySuccess = () => done(true);
        (window as any).payCancel = () => done(false);

        const timer = setInterval(function () {
          if (popup?.closed) {
            clearInterval(timer);
            done(false);
          }
        }, 1000);
      });

      setIsAwaitingPayment(false);

      if (success) {
        await checkout.placeOrder();
      }
    },
  };
  return checkout;
};
