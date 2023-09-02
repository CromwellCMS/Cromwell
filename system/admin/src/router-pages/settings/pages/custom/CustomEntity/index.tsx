import { ImageInput } from '@components/inputs/Image/ImageInput';
import { RegisteredTextInput } from '@components/inputs/TextInput';
import { settingsPageInfo } from '@constants/PageInfos';
import { TAdminCustomEntity } from '@cromwell/core';
import { slugify } from '@helpers/slugify';
import { SettingCategory } from '@pages/settings/components/SettingCategory';
import { CustomEntityFormType } from '@pages/settings/types';
import React, { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import { DraggableEntityFields } from '../../../components/draggableEntityFields';
import { SettingsPageInfo, useAdminSettings, useAdminSettingsContext } from '../../../hooks/useAdminSettings';

const info: SettingsPageInfo = {
  breadcrumbs: [
    { title: 'Settings', link: '/settings/' },
    { title: 'Custom Data', link: '/settings/custom-data' },
  ],
  saveVisible: true,
};

export const CustomEntitySettingsPage = () => {
  const { adminSettings } = useAdminSettingsContext();
  const params = useParams<{ entityType?: string }>();

  const entity = adminSettings?.customEntities?.find((e) => e.entityType === params.entityType);

  if (!entity) {
    return null;
  }

  return <CustomEntityForm entity={entity} />;
};

const CustomEntityForm = ({ entity }: { entity: TAdminCustomEntity }) => {
  const { adminSettings, saveCustomEntity } = useAdminSettingsContext();

  const navigate = useNavigate();
  const [uniqError, setUniqError] = useState(false);
  const methods = useForm<CustomEntityFormType>({
    defaultValues: {
      ...entity,
      customFields: adminSettings?.customFields?.filter((k) => k.entityType === entity.entityType),
    },
  });

  const { formState, watch, setValue, control, reset, handleSubmit } = methods;

  const entityLabel = watch('entityLabel', entity.entityLabel);
  const entityType = watch('entityType', entity.entityType);

  const onSubmit = async (data: CustomEntityFormType) => {
    const { customFields = [], ...inputs } = data;
    if (
      inputs.entityType !== entity.entityType &&
      adminSettings?.customEntities?.find((k) => k.entityType === inputs.entityType)
    ) {
      setUniqError(true);
      return;
    }
    const updatedFields = customFields.map((field, idx) => {
      return {
        ...field,
        entityType: inputs.entityType,
        order: idx,
      };
    });
    const saved = await saveCustomEntity(entity.entityType, inputs, updatedFields);

    if (saved) {
      reset(data);
      if (entity.entityType !== inputs.entityType) {
        navigate(`${settingsPageInfo.baseRoute}/custom-data/${inputs.entityType}`, { replace: true });
      }
    }
  };

  useAdminSettings({
    ...info,
    saveDisabled: !formState.isDirty,
    breadcrumbs: [
      ...(info.breadcrumbs || []),
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
  const dirtyDefinition =
    formState.dirtyFields?.entityLabel ||
    formState.dirtyFields?.entityType ||
    formState.dirtyFields?.icon ||
    formState.dirtyFields?.listLabel;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <SettingCategory
          title={`${entityLabel} definition`}
          description="Edit entity definition"
          dirty={dirtyDefinition}
          fields={
            <>
              <RegisteredTextInput
                name="entityLabel"
                label="Entity Label"
                placeholder="My Custom Entity"
                required
                description="Singular title for the entity."
                registerOptions={{ required: true }}
              />
              <RegisteredTextInput
                name="listLabel"
                label="Plural label"
                placeholder="My Custom Entities"
                required
                description="Plural title for the entity."
                registerOptions={{ required: true }}
              />
              <RegisteredTextInput
                name="entityType"
                label="Entity Type"
                placeholder="my-custom-entity"
                required
                error={
                  uniqError
                    ? 'An Entity with the same Entity Type already exists. Please change the entity type.'
                    : null
                }
                onChange={(event) => {
                  setValue('entityType', slugify(event.target.value.replace(' ', '-')), { shouldDirty: true });
                }}
                registerOptions={{ required: true }}
                description="The entity type is the unique identifier and used in the url. There's no need to change this value unless you want a different url identifier."
              />
              <div>
                <Controller
                  name="icon"
                  control={control}
                  render={({ field }) => (
                    <ImageInput
                      key={field.name}
                      onChange={(value) => field.onChange(value ?? '')}
                      value={field.value}
                      id="control"
                      label={'Icon'}
                      showRemove
                      backgroundSize="contain"
                      className="h-52 lg:max-w-[13rem]"
                    />
                  )}
                />
              </div>
            </>
          }
        />

        <SettingCategory
          title={`${entityLabel} custom fields`}
          description="Customize fields for this entity"
          dirty={dirtyCustomFields}
          fields={
            <div className="col-span-2">
              <DraggableEntityFields entityType={entityType} />
            </div>
          }
        />
      </form>
    </FormProvider>
  );
};
