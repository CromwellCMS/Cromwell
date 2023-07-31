import { getRandStr } from '@cromwell/core';
import { useForceUpdate } from '@cromwell/core-frontend';
import clsx from 'clsx';
import React from 'react';

import { BaseButton } from '../shared/Button';
import { BaseTextField } from '../shared/TextField';
import { usuCheckoutActions } from './actions';
import { DefaultCouponAppliedIcon, DefaultCouponProblemIcon, DefaultRemoveCouponIcon } from './DefaultElements';
import { CheckoutProps } from './Checkout';
import styles from './Coupons.module.scss';

/** @internal */
export function Coupons(props: { checkoutProps: CheckoutProps; checkout: ReturnType<typeof usuCheckoutActions> }) {
  const { checkout, checkoutProps } = props;
  const { isLoading, coupons } = checkout;
  const { classes, elements, text } = checkoutProps;
  const {
    Button = BaseButton,
    CouponProblemIcon = DefaultCouponProblemIcon,
    CouponAppliedIcon = DefaultCouponAppliedIcon,
    TextField = BaseTextField,
    RemoveCouponIcon = DefaultRemoveCouponIcon,
  } = elements ?? {};
  const { ApplyCouponButton = Button, RemoveCouponButton = Button, AddCouponButton = Button } = elements ?? {};
  const forceUpdate = useForceUpdate();

  return (
    <div className={clsx(styles.Coupons, classes?.Coupons)}>
      <div className={clsx(styles.couponList, classes?.couponList)}>
        {Object.entries(coupons).map(([couponId, coupon]) => {
          return (
            <div className={clsx(styles.coupon, classes?.coupon)} key={couponId}>
              {!isLoading && coupon.applied === true && <CouponAppliedIcon />}
              {!isLoading && coupon.applied === false && <CouponProblemIcon />}
              <TextField
                value={coupon.value}
                onChange={(e) => {
                  coupons[couponId].value = e.target.value;
                  forceUpdate();
                }}
                fullWidth
                size="small"
              />
              <RemoveCouponButton
                onClick={() => {
                  if (coupons[couponId].applied) {
                    setTimeout(checkout.getOrderTotal, 50);
                  }
                  delete coupons[couponId];
                  forceUpdate();
                }}
              >
                <RemoveCouponIcon />
              </RemoveCouponButton>
            </div>
          );
        })}
      </div>

      <div className={clsx(styles.couponActions, classes?.couponActions)}>
        <AddCouponButton
          variant="outlined"
          onClick={() => {
            coupons[getRandStr(8)] = { value: '', applied: null };
            forceUpdate();
          }}
        >
          {text?.addCoupon ?? 'Add coupon'}
        </AddCouponButton>
        <ApplyCouponButton
          variant="contained"
          onClick={() => {
            checkout.getOrderTotal();
          }}
        >
          {text?.apply ?? 'Apply'}
        </ApplyCouponButton>
      </div>
    </div>
  );
}
