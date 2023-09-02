import { CodeEditor } from '@components/inputs/CodeEditor';
import { getRestApiClient } from '@cromwell/core-frontend';
import React, { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { TextButton } from '@components/buttons/TextButton';

import { LoadingStatus } from '../../../components/loadBox/LoadingStatus';
import { toast } from '../../../components/toast/toast';
import { SettingCategory } from '../components/SettingCategory';
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
        <SettingCategory
          title="SEO Settings"
          description="Configure your SEO settings here."
          warning="Warning: This is a feature for tech-experts. Please use with caution. Wrong configurations may expose pages to bots."
          link={{
            href: 'https://cromwellcms.com/docs/features/seo',
            content: 'Read more in docs',
          }}
          fields={
            <>
              <label className="group active:text-indigo-500 col-span-2">
                <p className="font-bold pb-1 pl-[2px] text-gray-700">Robots.txt</p>
                <Controller
                  control={methods.control}
                  name="robotsContent"
                  render={({ field }) => (
                    <CodeEditor className="bg-white rounded-lg min-h-[250px]" language="ini" {...field} />
                  )}
                />
              </label>
              <div className="col-span-2"></div>
              <div className="flex flex-row my-6 gap-4 items-center">
                <TextButton type="button" onClick={buildSitemap}>
                  Rebuild sitemap
                </TextButton>
                <a
                  href={`/default_sitemap.xml`}
                  rel="noreferrer"
                  target="_blank"
                  className="text-gray-500 hover:text-indigo-700"
                >
                  View sitemap
                </a>
              </div>
            </>
          }
        />
      </form>
      <LoadingStatus isActive={rebuildingSitemap} />
    </FormProvider>
  );
};
