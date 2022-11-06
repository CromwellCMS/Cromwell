import { onStoreChange, removeOnStoreChange, TUpdateUser, TUser } from '@cromwell/core';
import { getGraphQLClient, getRestApiClient, useUserInfo } from '@cromwell/core-frontend';
import { useEffect, useState } from 'react';

import { notifier as baseNotifier } from '../../helpers/notifier';
import { AccountInfoProps } from './AccountInfo';
import { DefaultAccountFields, getDefaultAccountFields } from './DefaultElements';

/** @internal */
export const useAccountActions = (config: { props: AccountInfoProps }) => {
  const {
    fields = getDefaultAccountFields(config.props),
    text,
    notifier = baseNotifier,
    notifierOptions = {},
  } = config.props;
  const userInfo = useUserInfo();
  const [user, setUser] = useState<TUser | undefined>(userInfo);
  const [canShowValidation, setCanShowValidation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const onChange = (changed) => {
      setUser(changed);
    };
    const cbId = onStoreChange('userInfo', onChange);

    return () => {
      removeOnStoreChange('userInfo', cbId);
    };
  }, []);

  const actions = {
    user,
    canShowValidation,
    setUser,
    isLoading,
    changeUser: (key, value) => {
      setUser((prevState: any) => {
        return {
          ...prevState,
          [key]: value,
        };
      });
    },

    getFieldValue: (fieldKey): string | null => {
      const field = fields.find((f) => f.key === fieldKey);
      if (!field) return null;
      const isDefault = Object.values<string>(DefaultAccountFields).includes(fieldKey);
      let value;

      if (!isDefault) {
        let address;
        try {
          address = JSON.parse(user?.address ?? '{}');
        } catch (e) {}
        if (address) {
          value = address[field.key];
        }
      } else if (field.meta) {
        value = user?.customMeta?.[field.key];
      } else {
        value = user?.[field.key];
      }
      return value ?? null;
    },

    setFieldValue: (fieldKey, newValue: string) => {
      const field = fields.find((f) => f.key === fieldKey);
      if (!field) return null;
      const isDefault = Object.values<string>(DefaultAccountFields).includes(fieldKey);

      if (isDefault) {
        actions.changeUser(field.key as any, newValue);
      } else if (field.meta) {
        actions.changeUser('customMeta', {
          ...(user?.customMeta ?? {}),
          [field.key]: newValue,
        });
      } else {
        let address;
        try {
          address = JSON.parse(user?.address ?? '{}');
        } catch (e) {}
        if (typeof address !== 'object') address = {};
        address[field.key] = newValue;
        actions.changeUser('address', JSON.stringify(address));
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

      const value = actions.getFieldValue(fieldKey);
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

    isInputValid: () => {
      for (const field of fields) {
        if (!actions.isFieldValid(field.key).valid) return false;
      }
      return true;
    },

    saveInfo: async () => {
      if (!canShowValidation) setCanShowValidation(true);
      if (!actions.isInputValid() || !user || !userInfo) {
        return;
      }
      setIsLoading(true);

      const inputData: TUpdateUser = {
        slug: user.slug,
        pageTitle: user.pageTitle,
        pageDescription: user.pageDescription,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        phone: user.phone,
        address: user.address,
        roles: user.roles?.map((r) => r.name).filter(Boolean) as string[],
      };
      try {
        await getGraphQLClient()?.updateUser(userInfo.id, inputData);
        await actions.getUserAccount();
        notifier?.success?.(text?.saved ?? 'Saved!', { ...notifierOptions });
      } catch (e) {
        notifier?.error?.(text?.failedToSave ?? 'Failed to save', { ...notifierOptions });
        console.error(e);
      }

      setIsLoading(false);
    },

    getUserAccount: async (): Promise<TUser | undefined> => {
      let account;
      try {
        account = await getRestApiClient().getUserInfo({ disableLog: true });
      } catch (e) {
        console.error(e);
      }
      setUser(account);
      return account;
    },
  };

  return actions;
};
