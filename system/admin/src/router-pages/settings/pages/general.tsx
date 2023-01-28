import { RegisteredTextInput } from '@components/inputs/TextInput';
import { EDBEntity } from '@cromwell/core';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import { ImageInput } from '../../../components/inputs/Image/ImageInput';
import { languages } from '../../../constants/languages';
import { timezones } from '../../../constants/timezones';
import { CustomFieldSettings } from '../components/customFields';
import { RegisteredSelectField } from '../components/registeredSelectField';
import {
  SettingsPageInfo,
  TAdminCmsSettingsType,
  useAdminSettings,
  useAdminSettingsContext,
} from '../hooks/useAdminSettings';

type Lang = ArrayElement<typeof languages>;
type TZ = ArrayElement<typeof timezones>;

const getLangLabel = (lang?: Lang) => {
  return (
    <p className="text-gray-800">
      <span className="mr-2 text-gray-400">{lang?.code} - </span>
      <span className="text-gray-800">{lang?.name}</span>
    </p>
  );
};

const getTZLabel = (tz?: TZ) => {
  const identifier = tz?.text.split(')')[0].replace('(', '');
  const text = tz?.text.split(') ')[1];

  return (
    <p className="text-gray-800">
      <span className="mr-2 text-gray-400">{identifier ?? ''} - </span>
      <span className="text-gray-800">{text ?? ''}</span>
    </p>
  );
};

const getTZValue = (tz?: TZ) => tz?.value;

const getLangValue = (lang?: Lang) => lang?.code;

const info: SettingsPageInfo = {
  breadcrumbs: [
    { title: 'Settings', link: '/settings/' },
    { title: 'General', link: '/settings/general' },
  ],
  saveVisible: true,
};

export const GeneralSettingsPage = () => {
  const { adminSettings, saveAdminCmsSettings } = useAdminSettingsContext();
  const form = useForm<TAdminCmsSettingsType>({
    defaultValues: adminSettings,
  });

  const onSubmit = async (data: any) => {
    await saveAdminCmsSettings(data);

    form.reset(data);
  };

  useAdminSettings({
    ...info,
    saveDisabled: !form.formState.isDirty,
    onSave: () => {
      form.handleSubmit(onSubmit)();
    },
  });

  return (
    <FormProvider {...form}>
      <form className="relative" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2 relative lg:flex-row lg:gap-6">
          <div className="max-h-min my-1 lg:max-w-[13rem] top-16 self-start lg:order-2 lg:my-4 lg:sticky">
            <h2 className="font-bold text-gray-700 col-span-1">System settings</h2>
            <p>Configure global settings for the whole system.</p>
            <p className={`${form.formState.isDirty ? 'text-indigo-500' : 'text-transparent'}`}>
              You have unsaved changes
            </p>
          </div>

          <div
            className={`bg-white rounded-lg shadow-lg w-full p-4 max-w-4xl ${
              form.formState.isDirty ? 'border border-indigo-600 shadow-indigo-400' : 'border border-white'
            }`}
          >
            <div className="grid gap-2 grid-cols-1 lg:grid-cols-2">
              <RegisteredTextInput<TAdminCmsSettingsType>
                name="url"
                label="Website URL"
                placeholder="https://your-website.com"
              />
              <RegisteredSelectField
                options={languages}
                getDisplayValue={getLangLabel}
                getValue={getLangValue}
                inferValue={(v: string) => languages.find((l) => l.code === v)}
                name={`language`}
                label={'Language'}
                disabled
              />
              <div className="col-span-2">
                <RegisteredSelectField
                  options={timezones}
                  getDisplayValue={getTZLabel}
                  getValue={getTZValue}
                  inferValue={(v: string) => timezones.find((l) => l.value === parseInt(v))}
                  name={`timezone`}
                  label={'Timezone'}
                />
              </div>
              <div className="flex flex-col gap-2 lg:flex-row">
                <Controller
                  name="logo"
                  control={form.control}
                  render={({ field }) => (
                    <ImageInput
                      key={String(field.name)}
                      onChange={(value) => field.onChange(value ?? '')}
                      value={field.value}
                      id="logo"
                      label={'Logo'}
                      showRemove
                      backgroundSize="contain"
                      className="h-32 lg:max-w-[13rem]"
                    />
                  )}
                />
                <Controller
                  name="favicon"
                  control={form.control}
                  render={({ field }) => (
                    <ImageInput
                      key={field.name}
                      onChange={(value) => field.onChange(value ?? '')}
                      value={field.value}
                      id="favicon"
                      label={'Favicon'}
                      showRemove
                      backgroundSize="contain"
                      className="h-32 lg:max-w-[13rem]"
                    />
                  )}
                />
              </div>
              <div />
              <CustomFieldSettings entityType={EDBEntity.CMS} />
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
