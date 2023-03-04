import { CodeEditor } from '@components/inputs/CodeEditor';
import { getRestApiClient } from '@cromwell/core-frontend';
import React, { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import { LoadingStatus } from '../../../components/loadBox/LoadingStatus';
import { toast } from '../../../components/toast/toast';
import { SettingsPageInfo, useAdminSettings, useAdminSettingsContext } from '../hooks/useAdminSettings';
import { TAdminCmsSettingsType } from '../types';

type FormType = Pick<TAdminCmsSettingsType, 'robotsContent'>;

const info: SettingsPageInfo = {
  breadcrumbs: [
    { title: 'Settings', link: '/settings/' },
    { title: 'SEO', link: '/settings/seo' },
  ],
  saveVisible: true,
};

export const SEOSettingsPage = () => {
  const [rebuildingSitemap, setRebuilding] = useState(false);
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

  const buildSitemap = async () => {
    setRebuilding(true);
    try {
      await getRestApiClient().buildSitemap();
      toast.success('Sitemap has been rebuilt');
    } catch (e) {
      toast.error('Failed to rebuild Sitemap');
      console.error(e);
    }
    setRebuilding(false);
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
        <div className="flex flex-col z-4 gap-6 relative lg:flex-row">
          <div className="max-h-min my-4 lg:max-w-[13rem] top-16 self-start lg:order-2 lg:sticky">
            <h2 className="font-bold text-gray-700 col-span-1 text-2xl mb-5">SEO Settings</h2>
            <p>Configure your SEO settings here.</p>
            <p className="text-red-600">
              Warning: This is a feature for tech-experts. Please use with caution. Wrong configurations may expose
              pages to bots.
            </p>
            <p>
              <a href="https://cromwellcms.com/docs/features/seo" target="_blank" rel="noreferrer">
                Read more in docs
              </a>
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
                <p className="font-bold pb-1 pl-[2px] text-gray-700">Robots.txt</p>
                <Controller
                  control={methods.control}
                  name="robotsContent"
                  render={({ field }) => (
                    <CodeEditor className="bg-white rounded-lg min-h-[250px]" language="ini" {...field} />
                  )}
                />
              </label>

              <div className="flex flex-row my-6 gap-4 justify-between">
                <button
                  type="button"
                  onClick={buildSitemap}
                  className="rounded-lg bg-indigo-600 my-2 text-sm text-white py-1 px-4 uppercase self-center float-right hover:bg-indigo-500 disabled:bg-gray-700"
                >
                  rebuild sitemap
                </button>
                <a
                  href={`/default_sitemap.xml`}
                  rel="noreferrer"
                  target="_blank"
                  className="text-gray-500 hover:text-indigo-700"
                >
                  view sitemap
                </a>
              </div>
            </div>
          </div>
        </div>
      </form>
      <LoadingStatus isActive={rebuildingSitemap} />
    </FormProvider>
  );
};