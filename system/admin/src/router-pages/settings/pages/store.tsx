import { RegisteredSwitchInput } from '@components/inputs/SwitchInput';
import { RegisteredTextInput } from '@components/inputs/TextInput';
import { getCStore } from '@cromwell/core-frontend';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { GrabIcon } from '../../../components/icons/grabIcon';
import { DraggableCurrenciesList } from '../components/draggableCurrencies';
import { SettingCategory } from '../components/SettingCategory';
import { SettingsPageInfo, useAdminSettings, useAdminSettingsContext } from '../hooks/useAdminSettings';
import { TAdminCmsSettingsType } from '../types';

type FormType = Pick<TAdminCmsSettingsType, 'defaultShippingPrice' | 'currencies'> & { enablePayLater?: boolean };

const info: SettingsPageInfo = {
  breadcrumbs: [
    { title: 'Settings', link: '/settings/' },
    { title: 'Store', link: '/settings/store' },
  ],
  saveVisible: true,
};

export const StoreSettingsPage = () => {
  const { adminSettings, saveStoreSettings } = useAdminSettingsContext();
  const methods = useForm<FormType>({
    defaultValues: {
      enablePayLater: !adminSettings?.disablePayLater,
      ...adminSettings,
    },
  });

  const cstore = getCStore();

  const onSubmit = async (data: any) => {
    data.disablePayLater = !data.enablePayLater;
    delete data.enablePayLater;

    await saveStoreSettings(data);

    data.enablePayLater = !data.disablePayLater;
    methods.reset(data);
  };

  const shippingDirty = methods.formState.dirtyFields.defaultShippingPrice;
  const paymentsDirty = methods.formState.dirtyFields.enablePayLater;
  const currencyDirty = Object.keys(methods.formState.dirtyFields.currencies || {})
    .map((o) => {
      const fld = methods.formState.dirtyFields.currencies?.[o];
      return fld?.id || fld?.tag || fld.title || fld.symbol || fld.ratio;
    })
    .reduce((acc, cur) => acc || cur, false);

  const isDirty = methods.formState.isDirty;

  useAdminSettings({
    ...info,
    saveDisabled: !isDirty,
    onSave: () => {
      methods.handleSubmit(onSubmit)();
    },
  });

  return (
    <FormProvider {...methods}>
      <form className="relative" onSubmit={methods.handleSubmit(onSubmit)}>
        <SettingCategory
          title="Shipping Settings"
          description="Configure your shipping details"
          dirty={shippingDirty}
          fields={
            <div className="col-span-2">
              <RegisteredTextInput<FormType>
                label="Standard shipping price"
                placeholder="Enter shipping price"
                prefix={<span className="text-indigo-500">{cstore.getActiveCurrencySymbol()}</span>}
                name="defaultShippingPrice"
                type="number"
              />
            </div>
          }
        />

        <SettingCategory
          title="Payments Settings"
          description="Configure your payment details"
          dirty={paymentsDirty}
          fields={<RegisteredSwitchInput<FormType> label="Enable pay later" name="enablePayLater" />}
        />

        <SettingCategory
          dirty={currencyDirty}
          title="Currency Settings"
          description={
            <>
              Add currencies, exchange rates and set your primary currency. To change a currency to primary, drag it
              from <GrabIcon className="h-4 mx-1 w-4 inline-block" /> to the top of the list.
            </>
          }
          fields={
            <div className="col-span-2">
              <DraggableCurrenciesList />
            </div>
          }
        />
      </form>
    </FormProvider>
  );
};
