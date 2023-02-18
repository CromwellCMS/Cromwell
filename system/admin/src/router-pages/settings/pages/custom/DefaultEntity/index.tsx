import { TAdminCustomEntity } from '@cromwell/core';
import { CustomEntityFormType } from '@pages/settings/types';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { DraggableEntityFields } from '../../../components/draggableEntityFields';
import { SettingsPageInfo, useAdminSettings, useAdminSettingsContext } from '../../../hooks/useAdminSettings';
import { entities } from './constants';

const info: SettingsPageInfo = {
  breadcrumbs: [
    { title: 'Settings', link: '/settings/' },
    { title: 'Custom Data', link: '/settings/custom-data' },
  ],
  saveVisible: true,
};

export const DefaultEntitySettingsPage = ({ entityType = 'CMS' }) => {
  const entity = entities.find((k) => k.entityType === entityType);

  return <DefaultEntityForm entity={entity} />;
};

const DefaultEntityForm = ({ entity }: { entity: TAdminCustomEntity }) => {
  const { adminSettings, saveDefaultEntity } = useAdminSettingsContext();

  const methods = useForm<CustomEntityFormType>({
    defaultValues: {
      ...entity,
      customFields: adminSettings.customFields?.filter((k) => k.entityType === entity.entityType),
    },
  });
  const { formState, watch, reset, handleSubmit } = methods;

  const entityLabel = watch('entityLabel', entity.entityLabel);
  const entityType = watch('entityType', entity.entityType);

  const onSubmit = async (data: CustomEntityFormType) => {
    const { customFields = [], ...inputs } = data;
    const updatedFields = customFields.map((field, idx) => {
      return {
        ...field,
        entityType: inputs.entityType,
        order: idx,
      };
    });
    const saved = await saveDefaultEntity(entity.entityType, updatedFields);

    if (saved) {
      reset(data);
    }
  };

  useAdminSettings({
    ...info,
    saveDisabled: !formState.isDirty,
    breadcrumbs: [
      ...info.breadcrumbs,
      {
        title: entity?.entityLabel,
        link: `/settings/custom-data/${entity?.entityType}`,
      },
    ],
    onSave: () => {
      handleSubmit(onSubmit)();
    },
  });

  const dirtyCustomFields = !!formState.dirtyFields.customFields;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2 relative lg:flex-row lg:gap-6">
          <div className="max-h-min my-1 top-16 self-start lg:order-2 lg:my-4 lg:sticky">
            <h2 className="font-bold text-gray-700 col-span-1">{entityLabel} custom fields</h2>
            <p>Customize fields for {entityLabel}</p>
            <p className={`${dirtyCustomFields ? 'text-indigo-500' : 'text-transparent'}`}>You have unsaved changes</p>
          </div>

          <div
            className={`bg-white rounded-lg shadow-lg w-full p-4 max-w-4xl ${
              dirtyCustomFields ? 'border border-indigo-600 shadow-indigo-400' : 'border border-white'
            }`}
          >
            <div>
              <DraggableEntityFields entityType={entityType} />
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
