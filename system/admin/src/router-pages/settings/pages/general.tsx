import { RegisteredImageInput } from '@components/inputs/Image';
import { RegisteredSelectInput } from '@components/inputs/SelectInput';
import { RegisteredSwitchInput } from '@components/inputs/SwitchInput';
import { RegisteredTextInput } from '@components/inputs/TextInput';
import { languages } from '@constants/languages';
import { timezones } from '@constants/timezones';
import { EDBEntity } from '@cromwell/core';
import { RenderCustomFields } from '@helpers/customFields';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { Tooltip } from '@mui/material';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import { SettingCategory } from '../components/SettingCategory';
import { SettingsPageInfo, useAdminSettings, useAdminSettingsContext } from '../hooks/useAdminSettings';
import { TAdminCmsSettingsType } from '../types';

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
  const { adminSettings, saveAdminCmsSettings, getAdminCmsSettings } = useAdminSettingsContext();
  const form = useForm<TAdminCmsSettingsType>({
    defaultValues: {
      ...adminSettings,
      revalidateCacheAfter: adminSettings?.revalidateCacheAfter ?? 10,
      clearCacheOnDataUpdate: adminSettings?.clearCacheOnDataUpdate ?? true,
    },
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

  const websiteDirty =
    form.formState.dirtyFields.url ||
    form.formState.dirtyFields.timezone ||
    form.formState.dirtyFields.language ||
    form.formState.dirtyFields.logo ||
    form.formState.dirtyFields.favicon;

  const mailingDirty = form.formState.dirtyFields.sendFromEmail || form.formState.dirtyFields.sendMailFromName;
  const advancedDirty =
    form.formState.dirtyFields.revalidateCacheAfter || form.formState.dirtyFields.clearCacheOnDataUpdate;

  return (
    <FormProvider {...form}>
      <form className="relative" onSubmit={form.handleSubmit(onSubmit)}>
        <SettingCategory
          title="Website settings"
          description="Configure global settings for the whole system."
          dirty={websiteDirty}
          fields={
            <>
              <RegisteredTextInput<TAdminCmsSettingsType>
                name="url"
                label="Website URL"
                placeholder="https://your-website.com"
              />
              <RegisteredSelectInput
                options={languages}
                getDisplayValue={getLangLabel}
                getValue={getLangValue}
                name={`language`}
                label={'Language'}
                disabled
              />
              <div className="col-span-2">
                <RegisteredSelectInput
                  options={timezones}
                  getDisplayValue={getTZLabel}
                  getValue={getTZValue}
                  name={`timezone`}
                  label={'Timezone'}
                />
              </div>
              <div className="flex flex-col gap-2 lg:flex-row">
                <RegisteredImageInput<TAdminCmsSettingsType>
                  name="logo"
                  id="logo"
                  label={'Logo'}
                  showRemove
                  backgroundSize="contain"
                  className="h-32 lg:max-w-[13rem]"
                />
                <RegisteredImageInput<TAdminCmsSettingsType>
                  name="favicon"
                  id="favicon"
                  label={'Favicon'}
                  showRemove
                  backgroundSize="contain"
                  className="h-32 lg:max-w-[13rem]"
                />
              </div>

              <div className="col-span-2"></div>
              <Controller
                name="customMeta"
                control={form.control as any}
                render={({ field: formField }) => (
                  <RenderCustomFields
                    entityType={EDBEntity.CMS}
                    entityData={{
                      id: 1,
                      customMeta: formField.value,
                    }}
                    refetchMeta={() => getAdminCmsSettings().then((data) => data?.customMeta)}
                    onChange={(customField, value) =>
                      formField.onChange({
                        ...formField.value,
                        [customField.key]: value,
                      })
                    }
                  />
                )}
              />
            </>
          }
        />

        <SettingCategory
          title="Mailing settings"
          description="Configure settings for sending emails when evens happen."
          dirty={mailingDirty}
          fields={
            <>
              <RegisteredTextInput<TAdminCmsSettingsType>
                name="sendFromEmail"
                label={
                  <span>
                    Send e-mails from address:
                    <a
                      href="https://cromwellcms.com/docs/features/mail"
                      className="inline ml-1"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <InformationCircleIcon className="h-5 w-5 inline" />
                    </a>
                  </span>
                }
                placeholder="contact@your-website.com"
              />
              <RegisteredTextInput<TAdminCmsSettingsType>
                name="sendMailFromName"
                label={
                  <span>
                    Send e-mails from name
                    <a
                      href="https://cromwellcms.com/docs/features/mail"
                      className="inline ml-1"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <InformationCircleIcon className="h-5 w-5 inline" />
                    </a>
                  </span>
                }
                placeholder="Your-brand-name"
              />
              <RegisteredTextInput<TAdminCmsSettingsType>
                name="smtpConnectionString"
                label={
                  <span>
                    SMTP Connection String
                    <a
                      href="https://cromwellcms.com/docs/features/mail"
                      className="inline ml-1"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <InformationCircleIcon className="h-5 w-5 inline" />
                    </a>
                  </span>
                }
                placeholder="smtps://username:password@smtp.example.com"
              />
            </>
          }
        />
        <SettingCategory
          title="Advanced settings"
          description="Advanced system and web server settings."
          dirty={advancedDirty}
          fields={
            <>
              <RegisteredTextInput<TAdminCmsSettingsType>
                name="revalidateCacheAfter"
                label={
                  <span>
                    Invalidate theme&apos;s cache every (seconds)
                    <a
                      href="https://nextjs.org/docs/pages/building-your-application/data-fetching/incremental-static-regeneration"
                      className="inline ml-1"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Tooltip title="Controls `revalidate` prop to `getStaticProps` in Next.js">
                        <InformationCircleIcon className="h-5 w-5 inline" />
                      </Tooltip>
                    </a>
                  </span>
                }
                placeholder="10"
                type="number"
                className="mr-4"
                registerOptions={{ required: true }}
              />
              <RegisteredSwitchInput<TAdminCmsSettingsType>
                name="clearCacheOnDataUpdate"
                label={
                  <span>
                    {`Clear theme's cache on data update (such as products, categories, etc.)`}
                    <a
                      href="https://nextjs.org/docs/pages/building-your-application/data-fetching/incremental-static-regeneration"
                      className="inline ml-1"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Tooltip title="Clears Next.js Incremental static cache">
                        <InformationCircleIcon className="h-5 w-5 inline" />
                      </Tooltip>
                    </a>
                  </span>
                }
              />
            </>
          }
        />
      </form>
    </FormProvider>
  );
};
