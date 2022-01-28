import React from 'react';

import { BaseTextField, TBaseTextFieldProps } from '../shared/TextField';
import { usuCheckoutActions } from './actions';
import { CheckoutProps, TCheckoutField } from './Checkout';

export const DefaultCheckoutFields = {
  customerName: 'customerName',
  customerPhone: 'customerPhone',
  customerEmail: 'customerEmail',
  customerComment: 'customerComment',
}

export const DefaultPlacedOrder = (props) => <p>{props.children}</p>;
export const DefaultEmptyCartAlert = (props) => <p>{props.children}</p>;

export type TCheckoutFieldProps = Omit<TBaseTextFieldProps, 'onChange'> & {
  onChange: (value: any) => any;
  checkoutProps: CheckoutProps;
  checkout: ReturnType<typeof usuCheckoutActions>;
}

export const DefaultField = (props: TCheckoutFieldProps) => {
  const { checkout, checkoutProps, ...rest } = props;
  const { TextField = BaseTextField } = checkoutProps.elements ?? {};
  return (
    <TextField {...rest} onChange={e => checkout && props.onChange(e.target.value)} />
  );
}

export const DefaultCouponProblemIcon = () => <span style={{ color: '#b2102f', marginRight: '10px' }}>✖</span>;
export const DefaultCouponAppliedIcon = () => <span style={{ color: '#357a38', marginRight: '10px' }}>✔</span>;
export const DefaultRemoveCouponIcon = () => <span style={{ color: '#555' }}>✕</span>;


export const getDefaultCheckoutFields = (props: CheckoutProps): TCheckoutField[] => [
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
]