import { TAdminCustomEntity } from '@cromwell/core';
import React, { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Redirect, useHistory, useParams } from 'react-router-dom';

import { ActionButton } from '../../../../components/actionButton';
import { TBreadcrumbs } from '../../../../components/breadcrumbs';
import { ImageInput } from '../../../../components/inputs/Image/ImageInput';
import { TextInput } from '../../../../components/inputs/TextInput/TextInput';
import { slugify } from '../../../../helpers/slugify';
import { TAdminCmsSettingsType, useAdminSettings } from '../../../../hooks/useAdminSettings';
import { DraggableEntityFields } from '../../components/draggableEntityFields';

const titlePath = [
  { title: "Settings", link: "/settings/" },
  { title: "Custom Data", link: "/settings/custom-data" },
];

export type CustomField = ArrayElement<
TAdminCmsSettingsType["customFields"]
>

export type CustomEntityFormType = TAdminCustomEntity & {
  customFields: CustomField[]
}

export const CustomEntitySettingsPage = () => {
  const { adminSettings } = useAdminSettings();
  const params = useParams<{ entityType?: string }>();

  const entity = adminSettings.customEntities.find(
    (e) => e.entityType === params.entityType,
  );

  if (!entity) {
    return <Redirect to="/settings/custom-data" />;
  }

  return (
      <CustomEntityForm entity={entity} />
  );
};

const CustomEntityForm = ({
  entity,
}: {
  entity: TAdminCustomEntity;
}) => {
  const { adminSettings, saveCustomEntity } = useAdminSettings();
  const history = useHistory()
  const [uniqError, setUniqError] = useState(false);
  const methods = useForm<CustomEntityFormType>({
    defaultValues: {
      ...entity,
      customFields: adminSettings.customFields?.filter(k => k.entityType === entity.entityType),
    },
  });

  const {
    register,
    formState,
    watch,
    setValue,
    control,
    reset,
    handleSubmit,
  } = methods

  const entityLabel = watch(
    "entityLabel",
    entity.entityLabel,
  );

  const entityType = watch(
    "entityType",
    entity.entityType,
  );

  const onSubmit = async (data: CustomEntityFormType) => {
    const { customFields = [], ...inputs } = data
    if (inputs.entityType !== entity.entityType && adminSettings?.customEntities?.find(k => k.entityType === inputs.entityType)) {
      setUniqError(true)
      return;
    }
    const updatedFields = customFields.map((field, idx) => {
      return {
        ...field,
        entityType: inputs.entityType,
        order: idx,
      }
    })
    const saved = await saveCustomEntity(entity.entityType, inputs, updatedFields)

    if (saved) {
      reset(data)
      if (entity.entityType !== inputs.entityType) {
        history.replace(`/settings/custom-data/${inputs.entityType}`)
      }
    }
  };

  const dirtyCustomFields = !!formState.dirtyFields.customFields
  const dirtyDefinition = (formState.dirtyFields?.entityLabel ||
      formState.dirtyFields?.entityType ||
      formState.dirtyFields?.icon ||
      formState.dirtyFields?.listLabel)

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-row bg-gray-100 bg-opacity-60 w-full top-0 z-10 gap-2 backdrop-filter backdrop-blur-lg justify-between sticky">
          <div className="w-full max-w-4xl px-1 lg:px-0">
            <TBreadcrumbs
              path={[
                ...titlePath,
                {
                  title: entity?.entityLabel,
                  link: `/settings/custom-data/${entity?.entityType}`,
                },
              ]}
            />
            <ActionButton disabled={!formState.isDirty} type="submit" uppercase bold>save</ActionButton>
          </div>
        </div>
        <div className="flex flex-col gap-2 relative lg:flex-row lg:gap-6">
          <div className="max-h-min my-1 top-16 self-start lg:order-2 lg:my-4 lg:sticky">
            <h2 className="font-bold text-gray-700 col-span-1">
              {entityLabel} definition
            </h2>
            <p>Edit entity definition</p>
            <p
              className={`${
                dirtyDefinition
                  ? "text-indigo-500"
                  : "text-transparent"
              }`}>
              You have unsaved changes
            </p>
          </div>

          <div
            className={`bg-white rounded-lg shadow-lg w-full p-4 max-w-4xl ${
              dirtyDefinition
                ? "border border-indigo-600 shadow-indigo-400"
                : "border border-white"
            }`}>
            <div className="grid gap-2 grid-cols-1 lg:grid-cols-2">
              <TextInput
                label="Entity Label"
                placeholder="My Custom Entity"
                required
                description="Singular title for the entity."
                {...register("entityLabel", {
                  required: true,
                  onChange: (event) => {
                    const val = event.target.value;
                    setValue("entityType", slugify(val));
                  },
                })}
              />
              <TextInput
                label="Plural label"
                placeholder="My Custom Entities"
                required
                description="Plural title for the entity."
                {...register("listLabel", {
                  required: true,
                })}
              />
              <TextInput
                label="Entity Type"
                placeholder="my-custom-entity"
                required
                error={
                  uniqError
                    ? "An Entity with the same Entity Type already exists. Please change the entity type."
                    : null
                }
                description="The entity type is the unique identifier and used in the url. There's no need to change this value unless you want a different url identifier."
                {...register("entityType", {
                  required: true,
                  onChange: (event) => {
                    setValue(
                      "entityType",
                      slugify(event.target.value.replace(" ", "-")),
                    );
                  },
                })}
              />
              <div>
                <Controller
                  name="icon"
                  control={control}
                  render={({ field }) => (
                    <ImageInput
                      key={field.name}
                      onChange={(value) =>
                        field.onChange(value ?? "")
                      }
                      value={field.value}
                      id="control"
                      label={"Icon"}
                      showRemove
                      backgroundSize="contain"
                      className="h-52 lg:max-w-[13rem]"
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col mt-10 gap-2 relative lg:flex-row lg:gap-6">
          <div className="max-h-min my-1 top-16 self-start lg:order-2 lg:my-4 lg:sticky">
            <h2 className="font-bold text-gray-700 col-span-1">
              {entityLabel} custom fields
            </h2>
            <p>Customize fields for {entityLabel}</p>
            <p
              className={`${
                dirtyCustomFields
                  ? "text-indigo-500"
                  : "text-transparent"
              }`}>
              You have unsaved changes
            </p>
          </div>

          <div
            className={`bg-white rounded-lg shadow-lg w-full p-4 max-w-4xl ${
              dirtyCustomFields
                ? "border border-indigo-600 shadow-indigo-400"
                : "border border-white"
            }`}>
            <div className="">
              <DraggableEntityFields entityType={entityType} />
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
