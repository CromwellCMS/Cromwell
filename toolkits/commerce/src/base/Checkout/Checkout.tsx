import { TCromwellNotify, TOrder, TOrderPaymentSession, TPaymentOption, TShippingOption } from '@cromwell/core';
import { getCStore, LoadBox as DefaultLoadBox, useCart } from '@cromwell/core-frontend';
import clsx from 'clsx';
import React, { useRef } from 'react';

import { NotifierActionOptions } from '../../helpers/notifier';
import { BaseButton, TBaseButton } from '../shared/Button';
import { BaseRadio, TBaseRadio } from '../shared/Radio';
import { TBaseTextField } from '../shared/TextField';
import { usuCheckoutActions } from './actions';
import styles from './Checkout.module.scss';
import { Coupons } from './Coupons';
import {
  DefaultCheckoutFields,
  DefaultEmptyCartAlert,
  DefaultField,
  DefaultPlacedOrder,
  getDefaultCheckoutFields,
  CheckoutFieldProps,
} from './DefaultElements';

export type CheckoutFieldConfig = {
  key: keyof typeof DefaultCheckoutFields | string;
  label?: string;
  validate?: (value?: string | null) => { valid: boolean; message: string };
  required?: boolean;
  Component?: React.ComponentType<CheckoutFieldProps>;
  meta?: boolean;
};

export type CheckoutProps = {
  classes?: Partial<
    Record<
      | 'root'
      | 'blockTitle'
      | 'delimiter'
      | 'detailsRow'
      | 'withoutDiscountText'
      | 'withoutDiscountValue'
      | 'detailsRowName'
      | 'detailsRowValue'
      | 'totalText'
      | 'totalValue'
      | 'Coupons'
      | 'couponList'
      | 'coupon'
      | 'couponActions'
      | 'placedOrder'
      | 'loadBoxCover'
      | 'actionsBlock'
      | 'placedOrderText',
      string
    >
  >;

  elements?: {
    Loadbox?: React.ComponentType;
    PlacedOrder?: React.ComponentType<{ order: TOrder; children?: React.ReactNode }>;
    EmptyCartAlert?: React.ComponentType;
    RadioGroup?: TBaseRadio;
    Button?: TBaseButton;
    ApplyCouponButton?: TBaseButton;
    AddCouponButton?: TBaseButton;
    RemoveCouponButton?: TBaseButton;
    CouponAppliedIcon?: React.ComponentType;
    CouponProblemIcon?: React.ComponentType;
    RemoveCouponIcon?: React.ComponentType;
    TextField?: TBaseTextField;
  };

  text?: {
    yourOrderPlaced?: string;
    shippingAddress?: string;
    shippingMethods?: string;
    coupons?: string;
    orderDetails?: string;
    cartWithoutDiscount?: string;
    cartTotal?: string;
    shipping?: string;
    total?: string;
    paymentMethods?: string;
    yourCartIsEmpty?: string;
    placeOrder?: string;
    pay?: string;
    fieldIsRequired?: string;
    invalidEmail?: string;
    standardShipping?: string;
    payLater?: string;
    addCoupon?: string;
    apply?: string;
    fillOrderInformation?: string;
    failedCreateOrder?: string;
    noPaymentsAvailable?: string;
    choosePaymentMethod?: string;
    somethingWrongWithPayment?: string;
  };

  /**
   * Order fields to display. Key can be one of enum `DefaultCheckoutFields` or any string.
   * If key is not part of enum, then it will be treated as part
   * of JSON `customerAddress`. If flag `meta` is provided then key will
   * be treated as part of `customMeta`.
   */
  fields?: CheckoutFieldConfig[];

  /**
   * Additional payment options
   */
  getPaymentOptions?: (session?: TOrderPaymentSession | null) => Promise<TPaymentOption[]> | TPaymentOption[];

  /**
   * Notifier tool. To disable notifications pass an empty object
   */
  notifier?: TCromwellNotify<NotifierActionOptions>;
  /**
   * Notifier options
   */
  notifierOptions?: NotifierActionOptions;

  /**
   * Order action events
   */
  onGetOrderTotal?: (data: TOrderPaymentSession | undefined | null) => void;
  onPlaceOrder?: (placedOrder: TOrder | undefined | null) => void;
  onPay?: (success: boolean) => void;

  /**
   * Change text of backend errors before showing notifications.
   */
  changeErrorText?: (message: string) => string;
};

/**
 * Displays checkout session.
 * Handles order calculations, coupons, payments and order placement.
 * Provide prop `fields` to display any input field, such as: email, phone, etc.
 */
export function Checkout(props: CheckoutProps) {
  const { fields = getDefaultCheckoutFields(props), classes, text } = props;
  const {
    PlacedOrder = DefaultPlacedOrder,
    RadioGroup = BaseRadio,
    EmptyCartAlert = DefaultEmptyCartAlert,
    Button = BaseButton,
    Loadbox = DefaultLoadBox,
  } = props.elements ?? {};
  const cstore = getCStore();

  const rootRef = useRef<HTMLDivElement | null>(null);
  const checkout = usuCheckoutActions({
    checkoutProps: props,
    rootRef,
  });
  const cart = useCart();

  const { order, paymentSession, changeOrder, standardShipping, payLaterOption } = checkout;

  const shippingOptions: TShippingOption[] = [...(checkout.paymentSession?.shippingOptions ?? [])]
    .filter(Boolean)
    .map((option) => {
      if (option.key === standardShipping.key) {
        option.name = standardShipping.name;
      }
      return option;
    });

  const paymentOptions: TPaymentOption[] = [
    ...(checkout?.additionalPaymentOptions ?? []),
    ...(checkout.paymentSession?.paymentOptions ?? []),
  ]
    .filter(Boolean)
    .map((option) => {
      if (option.key === payLaterOption.key) {
        option.name = payLaterOption.name;
      }
      return option;
    });

  const wrapContent = (content: JSX.Element) => {
    return (
      <div className={clsx(styles.Checkout, classes?.root)} ref={rootRef}>
        {content}
        {checkout.isLoading && (
          <div className={clsx(styles.loadBoxCover, classes?.loadBoxCover)}>
            <Loadbox />
          </div>
        )}
      </div>
    );
  };

  if (checkout.placedOrder) {
    return wrapContent(
      <div id="ccom-order-placed-success">
        <PlacedOrder order={checkout.placedOrder}>
          <p className={clsx(styles.placedOrderText, classes?.placedOrderText)}>
            {text?.yourOrderPlaced ?? 'Your order has been placed! Order ID:'} {checkout.placedOrder?.id}
          </p>
        </PlacedOrder>
      </div>,
    );
  }

  if (!cart?.length) {
    return wrapContent(<EmptyCartAlert>{text?.yourCartIsEmpty ?? 'Your cart is empty'}</EmptyCartAlert>);
  }

  return wrapContent(
    <>
      <h2 className={clsx(styles.blockTitle, classes?.blockTitle)}>{text?.shippingAddress ?? 'Shipping Address'}</h2>
      {fields?.map((field) => {
        const Component: React.ComponentType<CheckoutFieldProps> = field.Component ?? DefaultField;
        const value = checkout.getFieldValue(field.key) ?? '';
        const validation = checkout.isFieldValid(field.key);

        return (
          <Component
            value={value}
            key={field.key}
            checkout={checkout}
            checkoutProps={props}
            label={field.label}
            onChange={(newValue) => {
              checkout.setFieldValue(field.key, newValue);
            }}
            error={checkout.canShowValidation && !validation.valid}
            helperText={checkout.canShowValidation && !validation.valid ? validation.message : undefined}
          />
        );
      })}
      <div className={clsx(styles.delimiter, classes?.delimiter)}></div>

      <h2 className={clsx(styles.blockTitle, classes?.blockTitle)}>{text?.shippingMethods ?? 'Shipping Methods'}</h2>
      <RadioGroup
        value={order.shippingMethod ?? ''}
        onChange={(e, value) => changeOrder('shippingMethod', value)}
        options={shippingOptions.map((option) => ({
          value: option.key,
          label: option.label ?? `${option.name}: ${cstore.getPriceWithCurrency(option.price)}`,
        }))}
      />
      <div className={clsx(styles.delimiter, classes?.delimiter)}></div>

      <h2 className={clsx(styles.blockTitle, classes?.blockTitle)}>{text?.coupons ?? 'Coupons'}</h2>
      <Coupons checkout={checkout} checkoutProps={props} />
      <div className={clsx(styles.delimiter, classes?.delimiter)}></div>

      <h2 className={clsx(styles.blockTitle, classes?.blockTitle)}>{text?.orderDetails ?? 'Order details'}</h2>
      {!!(
        paymentSession?.cartTotalPrice &&
        paymentSession?.cartOldTotalPrice &&
        paymentSession.cartTotalPrice !== paymentSession.cartOldTotalPrice
      ) && (
        <div className={clsx(styles.detailsRow, classes?.detailsRow)}>
          <p className={clsx(styles.withoutDiscountText, classes?.withoutDiscountText)}>
            {text?.cartWithoutDiscount ?? 'Cart total without discount:'}
          </p>
          <p className={clsx(styles.withoutDiscountValue, classes?.withoutDiscountValue)}>
            {cstore.getPriceWithCurrency(paymentSession.cartOldTotalPrice)}
          </p>
        </div>
      )}
      <div className={clsx(styles.detailsRow, classes?.detailsRow)}>
        <p className={clsx(styles.detailsRowName, classes?.detailsRowName)}>{text?.cartTotal ?? 'Cart total:'}</p>
        <p className={clsx(styles.detailsRowValue, classes?.detailsRowValue)}>
          {cstore.getPriceWithCurrency(paymentSession?.cartTotalPrice)}
        </p>
      </div>
      <div className={clsx(styles.detailsRow, classes?.detailsRow)}>
        <p className={clsx(styles.detailsRowName, classes?.detailsRowName)}>{text?.shipping ?? 'Shipping:'}</p>
        <p className={clsx(styles.detailsRowValue, classes?.detailsRowValue)}>
          {cstore.getPriceWithCurrency(paymentSession?.shippingPrice)}
        </p>
      </div>
      <div className={clsx(styles.detailsRow, classes?.detailsRow)}>
        <p className={clsx(styles.totalText, classes?.totalText)}>{text?.total ?? 'Total:'}</p>
        <b className={clsx(styles.totalValue, classes?.totalValue)}>
          {cstore.getPriceWithCurrency(paymentSession?.orderTotalPrice)}
        </b>
      </div>
      <div className={clsx(styles.delimiter, classes?.delimiter)} style={{ borderColor: 'transparent' }}></div>

      <h2 className={clsx(styles.blockTitle, classes?.blockTitle)}>{text?.paymentMethods ?? 'Payment Methods'}</h2>
      <RadioGroup
        value={order.paymentMethod ?? ''}
        onChange={(e, value) => changeOrder('paymentMethod', value)}
        options={paymentOptions.map((option) => ({
          value: option.key ?? option.name!,
          label: option.name ?? option.key!,
        }))}
      />

      <div className={clsx(styles.actionsBlock, classes?.actionsBlock)}>
        {order.paymentMethod === payLaterOption.key && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={checkout.placeOrder}
            disabled={checkout.isLoading || checkout.isAwaitingPayment}
          >
            {text?.placeOrder ?? 'Place order'}
          </Button>
        )}
        {order.paymentMethod && order.paymentMethod !== payLaterOption.key && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={checkout.pay}
            disabled={checkout.isLoading || checkout.isAwaitingPayment}
          >
            {text?.pay ?? 'Pay'}
          </Button>
        )}
      </div>
    </>,
  );
}
