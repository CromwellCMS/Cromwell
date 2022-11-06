import { getCStore } from '@cromwell/core-frontend';
import CodeEditor from '@uiw/react-textarea-code-editor';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import { TBreadcrumbs } from '../../../components/breadcrumbs';
import { TAdminCmsSettingsType, useAdminSettings } from '../../../hooks/useAdminSettings';

type FormType = Pick<TAdminCmsSettingsType, 'headHtml' | 'footerHtml'>;

const titlePath = [
  { title: 'Settings', link: '/settings/' },
  { title: 'Code', link: '/settings/code' },
];

export const CodeSettingsPage = () => {
  const { adminSettings, saveCodeSettings } = useAdminSettings();
  const methods = useForm<FormType>({
    defaultValues: {
      ...adminSettings,
    },
  });
  const cstore = getCStore();

  const onSubmit = async (data: any) => {
    await saveCodeSettings(data);

    methods.reset(data);
  };

  const isDirty = methods.formState.isDirty;

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
            <h2 className="font-bold text-gray-700 col-span-1">Code Injection</h2>
            <p>
              Code under Head will be placed on the {'<head></head>'} section of the website. Footer HTML will be placed
              at the bottom of {'<body />'}.
            </p>
            <p className="text-red-600">
              Warning: This is a feature for tech-experts. Please use with caution and do not inject any malicious code.
            </p>
            <p className={`${isDirty ? 'text-indigo-500' : 'text-transparent'}`}>You have unsaved changes</p>
          </div>

          <div
            className={`bg-white rounded-lg shadow-lg w-full p-4 max-w-4xl ${
              isDirty ? 'border border-indigo-600 shadow-indigo-400' : 'border border-white'
            }`}
          >
            <div className="grid gap-2 grid-cols-1">
              <label className="group active:text-indigo-500">
                <p className="font-bold pb-1 pl-[2px] text-gray-700">HEAD HTML</p>
                <Controller
                  control={methods.control}
                  name="headHtml"
                  render={({ field }) => (
                    <CodeEditor className="bg-white rounded-lg min-h-[250px]" language="html" {...field} />
                  )}
                />
              </label>
              <label className="group active:text-indigo-500">
                <p className="font-bold pb-1 pl-[2px] text-gray-700">FOOTER HTML</p>
                <Controller
                  control={methods.control}
                  name="footerHtml"
                  render={({ field }) => (
                    <CodeEditor className="bg-white rounded-lg min-h-[250px]" language="html" {...field} />
                  )}
                />
              </label>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
