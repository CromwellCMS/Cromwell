import { CodeEditor } from '@components/inputs/CodeEditor';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { SettingCategory } from '../components/SettingCategory';

import { SettingsPageInfo, useAdminSettings, useAdminSettingsContext } from '../hooks/useAdminSettings';
import { TAdminCmsSettingsType } from '../types';

type FormType = Pick<TAdminCmsSettingsType, 'headHtml' | 'footerHtml'>;

const info: SettingsPageInfo = {
  breadcrumbs: [
    { title: 'Settings', link: '/settings/' },
    { title: 'Code', link: '/settings/code' },
  ],
  saveVisible: true,
};

export const CodeSettingsPage = () => {
  const { adminSettings, saveCodeSettings } = useAdminSettingsContext();
  const methods = useForm<FormType>({
    defaultValues: {
      ...adminSettings,
    },
  });

  const onSubmit = async (data: any) => {
    await saveCodeSettings(data);

    methods.reset(data);
  };

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
          title="Code Injection"
          description="Code under Head will be placed on the <head></head> section of the website. Footer HTML will be placed at the bottom of <body />."
          warning="Warning: This is a feature for tech-experts. Please use with caution and do not inject any malicious code."
          dirty={isDirty}
          fields={
            <>
              <label className="group active:text-indigo-500 col-span-2">
                <p className="font-bold pb-1 pl-[2px] text-gray-700">HEAD HTML</p>
                <Controller
                  control={methods.control}
                  name="headHtml"
                  render={({ field }) => (
                    <CodeEditor className="bg-white rounded-lg min-h-[250px]" language="html" {...field} />
                  )}
                />
              </label>
              <label className="group active:text-indigo-500 col-span-2">
                <p className="font-bold pb-1 pl-[2px] text-gray-700">FOOTER HTML</p>
                <Controller
                  control={methods.control}
                  name="footerHtml"
                  render={({ field }) => (
                    <CodeEditor className="bg-white rounded-lg min-h-[250px]" language="html" {...field} />
                  )}
                />
              </label>
            </>
          }
        />
      </form>
    </FormProvider>
  );
};
