import React from 'react';

import { BaseTextField, TBaseTextFieldProps } from '../shared/TextField';
import { usuCheckoutActions } from './actions';
import { CheckoutProps, CheckoutFieldConfig } from './Checkout';

export const DefaultCheckoutFields = {
  customerName: 'customerName',
  customerPhone: 'customerPhone',
  customerEmail: 'customerEmail',
  customerComment: 'customerComment',
};

/** @internal */
export const DefaultPlacedOrder = (props: { children?: React.ReactNode }) => <p>{props.children}</p>;
/** @internal */
export const DefaultEmptyCartAlert = (props: { children?: React.ReactNode }) => <p>{props.children}</p>;

export type CheckoutFieldProps = Omit<TBaseTextFieldProps, 'onChange'> & {
  onChange: (value: any) => any;
  checkoutProps: CheckoutProps;
  checkout: ReturnType<typeof usuCheckoutActions>;
};

/** @internal */
export const DefaultField = (props: CheckoutFieldProps) => {
  const { checkoutProps, ...rest } = props;
  const { TextField = BaseTextField } = checkoutProps.elements ?? {};
  return <TextField {...rest} onChange={(e) => props.onChange(e.target.value)} />;
};

/** @internal */
export const DefaultCouponProblemIcon = () => <span style={{ color: '#b2102f', marginRight: '10px' }}>✖</span>;
/** @internal */
export const DefaultCouponAppliedIcon = () => <span style={{ color: '#357a38', marginRight: '10px' }}>✔</span>;
/** @internal */
export const DefaultRemoveCouponIcon = () => <span style={{ color: '#555' }}>✕</span>;

/** @internal */
export const getDefaultCheckoutFields = (props: CheckoutProps): CheckoutFieldConfig[] => [
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
      message: props.text?.invalidEmail ?? 'Invalid email',
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
];
