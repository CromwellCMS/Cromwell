import React from 'react';

import { BaseTextField } from '../shared/TextField';
import { AccountFieldConfig, AccountFieldProps, AccountInfoProps } from './AccountInfo';


export const DefaultAccountFields = {
    fullName: 'fullName',
    email: 'email',
    avatar: 'avatar',
    bio: 'bio',
    phone: 'phone',
    address: 'address',
}

/** @internal */
export const DefaultField: React.ComponentType<AccountFieldProps> = (props: AccountFieldProps) => {
    const { accountInfoProps, ...rest } = props;
    const { TextField = BaseTextField } = accountInfoProps?.elements ?? {};
    return (
        <TextField {...rest} onChange={e => props.onChange(e.target.value)} />
    );
}


/** @internal */
export const getDefaultAccountFields = (props: AccountInfoProps): AccountFieldConfig[] => [
    {
        key: DefaultAccountFields.fullName,
        required: true,
        label: 'Full name',
    },
    {
        key: DefaultAccountFields.email,
        required: true,
        validate: (value) => ({
            valid: !!value && /\S+@\S+\.\S+/.test(value),
            message: props.text?.invalidEmail ?? 'Invalid email',
        }),
        label: 'E-mail',
    },
    {
        key: DefaultAccountFields.phone,
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
