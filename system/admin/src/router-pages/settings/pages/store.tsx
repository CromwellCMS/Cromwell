import { RegisteredSwitchInput } from '@components/inputs/SwitchInput';
import { RegisteredTextInput } from '@components/inputs/TextInput';
import { getCStore } from '@cromwell/core-frontend';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { GrabIcon } from '../../../components/icons/grabIcon';
import { DraggableCurrenciesList } from '../components/draggableCurrencies';
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
      enablePayLater: !adminSettings.disablePayLater,
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
      const fld = methods.formState.dirtyFields.currencies[o];
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
        <div className="flex flex-col z-4 relative lg:flex-row mb-8">
          <div className="max-h-min my-4 lg:max-w-[13rem] top-16 self-start lg:order-2 lg:sticky">
            <h2 className="font-bold text-gray-700 col-span-1 text-2xl mb-3">Shipping Settings</h2>
            <p>Configure your shipping details</p>
            <p className={`${shippingDirty ? 'text-indigo-500' : 'text-transparent'}`}>You have unsaved changes</p>
          </div>

          <div
            className={`bg-white rounded-lg shadow-lg w-full p-4 max-w-4xl ${
              shippingDirty ? 'border border-indigo-600 shadow-indigo-400' : 'border border-white'
            }`}
          >
            <div className="grid gap-2 grid-cols-1 lg:grid-cols-2">
              <RegisteredTextInput<FormType>
                label="Standard shipping price"
                placeholder="Enter shipping price"
                prefix={<span className="text-indigo-500">{cstore.getActiveCurrencySymbol()}</span>}
                name="defaultShippingPrice"
                type="number"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col z-4 relative lg:flex-row mb-8">
          <div className="max-h-min my-4 lg:max-w-[13rem] top-16 self-start lg:order-2 lg:sticky">
            <h2 className="font-bold text-gray-700 col-span-1 text-2xl mb-3">Payments Settings</h2>
            <p>Configure your payment details</p>
            <p className={`${paymentsDirty ? 'text-indigo-500' : 'text-transparent'}`}>You have unsaved changes</p>
          </div>

          <div
            className={`bg-white rounded-lg shadow-lg w-full p-4 max-w-4xl ${
              paymentsDirty ? 'border border-indigo-600 shadow-indigo-400' : 'border border-white'
            }`}
          >
            <div className="grid gap-2 grid-cols-1 lg:grid-cols-2">
              <RegisteredSwitchInput<FormType> label="Enable pay later" name="enablePayLater" />
            </div>
          </div>
        </div>

        <div className="flex flex-col mt-6 relative lg:flex-row mb-8">
          <div className="flex-shrink max-h-min my-4 lg:max-w-[13rem] top-16 self-start lg:order-2 lg:sticky">
            <h2 className="font-bold text-gray-700 col-span-1 text-2xl mb-3">Currency Settings</h2>
            <p>
              Add currencies, exchange rates and set your primary currency. To change a currency to primary, drag it
              from <GrabIcon className="h-4 mx-1 w-4 inline-block" /> to the top of the list.
            </p>
            <p className={`${currencyDirty ? 'text-indigo-500' : 'text-transparent'}`}>You have unsaved changes</p>
          </div>

          <div
            className={`bg-white flex-grow rounded-lg shadow-lg w-full p-4 max-w-4xl ${
              currencyDirty ? 'border border-indigo-600 shadow-indigo-400' : 'border border-white'
            }`}
          >
            <DraggableCurrenciesList />
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
