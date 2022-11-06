import { getCStore } from '@cromwell/core-frontend';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { TBreadcrumbs } from '../../../components/breadcrumbs';
import { GrabIcon } from '../../../components/icons/grabIcon';
import { TextInput } from '../../../components/inputs/TextInput/TextInput';
import { TAdminCmsSettingsType, useAdminSettings } from '../../../hooks/useAdminSettings';
import { DraggableCurrenciesList } from '../components/draggableCurrencies';

type FormType = Pick<TAdminCmsSettingsType, 'defaultShippingPrice' | 'currencies'>;

const titlePath = [
  { title: 'Settings', link: '/settings/' },
  { title: 'Store', link: '/settings/store' },
];

export const StoreSettingsPage = () => {
  const { adminSettings, saveStoreSettings } = useAdminSettings();
  const methods = useForm<FormType>({
    defaultValues: {
      ...adminSettings,
    },
  });

  const cstore = getCStore();

  const onSubmit = async (data: any) => {
    await saveStoreSettings(data);

    methods.reset(data);
  };

  const shippingDirty = methods.formState.dirtyFields.defaultShippingPrice;
  const currencyDirty = Object.keys(methods.formState.dirtyFields.currencies || {})
    .map((o) => {
      const fld = methods.formState.dirtyFields.currencies[o];
      return fld?.id || fld?.tag || fld.title || fld.symbol || fld.ratio;
    })
    .reduce((acc, cur) => acc || cur, false);

  return (
    <FormProvider {...methods}>
      <form className="relative" onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="flex flex-row bg-gray-100 bg-opacity-60 w-full top-0 z-10 gap-2 backdrop-filter backdrop-blur-lg justify-between sticky">
          <div className="w-full max-w-4xl px-1 lg:px-0">
            <TBreadcrumbs path={titlePath} />
            <button
              type="submit"
              disabled={!methods.formState.isDirty}
              className="rounded-lg font-bold bg-indigo-600 my-2 text-sm text-white py-1 px-4 uppercase self-center float-right hover:bg-indigo-500 disabled:bg-gray-700"
            >
              save
            </button>
          </div>
        </div>

        <div className="flex flex-col z-4 gap-6 relative lg:flex-row">
          <div className="max-h-min my-4 lg:max-w-[13rem] top-16 self-start lg:order-2 lg:sticky">
            <h2 className="font-bold text-gray-700 col-span-1">Shipping Settings</h2>
            <p>Configure your shipping details</p>
            <p className={`${shippingDirty ? 'text-indigo-500' : 'text-transparent'}`}>You have unsaved changes</p>
          </div>

          <div
            className={`bg-white rounded-lg shadow-lg w-full p-4 max-w-4xl ${
              shippingDirty ? 'border border-indigo-600 shadow-indigo-400' : 'border border-white'
            }`}
          >
            <div className="grid gap-2 grid-cols-1 lg:grid-cols-2">
              <TextInput
                label="Standard shipping price"
                placeholder="Enter shipping price"
                prefix={<span className="text-indigo-500">{cstore.getActiveCurrencySymbol()}</span>}
                {...methods.register('defaultShippingPrice', { valueAsNumber: true })}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col mt-6 gap-6 relative lg:flex-row">
          <div className="flex-shrink max-h-min my-4 lg:max-w-[13rem] top-16 self-start lg:order-2 lg:sticky">
            <h2 className="font-bold text-gray-700 col-span-1">Currency Settings</h2>
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
