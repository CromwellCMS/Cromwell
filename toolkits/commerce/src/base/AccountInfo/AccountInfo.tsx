import { TCromwellNotify } from '@cromwell/core';
import clsx from 'clsx';
import React from 'react';

import { NotifierActionOptions } from '../../helpers/notifier';
import { BaseButton, TBaseButton } from '../shared/Button';
import { TBaseTextField, TBaseTextFieldProps } from '../shared/TextField';
import styles from './AccountInfo.module.scss';
import { useAccountActions } from './actions';
import { DefaultAccountFields, DefaultField, getDefaultAccountFields } from './DefaultElements';

export type AccountInfoProps = {
  classes?: Partial<Record<'root' | 'saveButton', string>>;

  elements?: {
    Button?: TBaseButton;
    TextField?: TBaseTextField;
  };

  text?: {
    invalidEmail?: string;
    fieldIsRequired?: string;
    failedToSave?: string;
    saved?: string;
  };

  /**
   * User fields to display. Key can be one of enum `DefaultAccountFields` or any string.
   * If key is not part of enum, then it will be treated as part
   * of JSON `address`. If flag `meta` is provided then key will
   * be treated as part of `customMeta`.
   */
  fields?: AccountFieldConfig[];

  /**
   * Notifier tool. To disable notifications pass an empty object
   */
  notifier?: TCromwellNotify<NotifierActionOptions>;
  /**
   * Notifier options
   */
  notifierOptions?: NotifierActionOptions;
};

export type AccountFieldProps = Omit<TBaseTextFieldProps, 'onChange'> & {
  onChange: (value: any) => any;
  accountInfoProps?: AccountInfoProps;
  actions?: ReturnType<typeof useAccountActions>;
};

export type AccountFieldConfig = {
  key: keyof typeof DefaultAccountFields | string;
  label?: string;
  validate?: (value?: string | null) => { valid: boolean; message: string };
  required?: boolean;
  Component?: React.ComponentType<AccountFieldProps>;
  meta?: boolean;
};

/**
 * Displays account fields (such as phone, address, email, etc)
 * and allows users to change them. User must be logged in via `SignIn` component
 * of `@cromwell/core-frontend` or via `AuthClient` (`getAuthClient`) for this
 * component to work.
 */
export function AccountInfo(props: AccountInfoProps) {
  const { fields = getDefaultAccountFields(props), elements, classes } = props;
  const { Button = BaseButton } = elements ?? {};
  const actions = useAccountActions({ props });

  if (!actions.user) return null;

  return (
    <div className={clsx(styles.AccountInfo, classes?.root)}>
      {fields?.map((field) => {
        const Component = field.Component ?? DefaultField;
        const value = actions.getFieldValue(field.key) ?? '';
        const validation = actions.isFieldValid(field.key);

        return (
          <Component
            value={value}
            key={field.key}
            actions={actions}
            accountInfoProps={props}
            label={field.label}
            onChange={(newValue) => {
              actions.setFieldValue(field.key, newValue);
            }}
            error={actions.canShowValidation && !validation.valid}
            helperText={actions.canShowValidation && !validation.valid ? validation.message : undefined}
          />
        );
      })}
      <Button
        variant="contained"
        color="primary"
        className={clsx(styles.saveButton, classes?.saveButton)}
        size="small"
        onClick={actions.saveInfo}
      >
        Update
      </Button>
    </div>
  );
}
