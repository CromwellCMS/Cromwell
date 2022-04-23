import {
  EDBEntity,
  TAdminCustomEntity,
} from "@cromwell/core";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { ActionButton } from "../../../../components/actionButton";
import { TBreadcrumbs } from "../../../../components/breadcrumbs";
import {
  TAdminCmsSettingsType,
  useAdminSettings,
} from "../../../../hooks/useAdminSettings";
import { DraggableEntityFields } from "../../components/draggableEntityFields";

const titlePath = [
  { title: "Settings", link: "/settings/" },
  { title: "Custom Data", link: "/settings/custom-data" },
];

const entities = [
  {
    entityType: EDBEntity.Product,
    entityLabel: "Product",
    listLabel: "Products",
  },
  {
    entityType: EDBEntity.ProductCategory,
    entityLabel: "Category",
    listLabel: "Categories",
  },
  {
    entityType: EDBEntity.Post,
    entityLabel: "Post",
    listLabel: "Posts",
  },
  {
    entityType: EDBEntity.Tag,
    entityLabel: "Tag",
    listLabel: "Tags",
  },
  {
    entityType: EDBEntity.User,
    entityLabel: "User",
    listLabel: "Users",
  },
  {
    entityType: EDBEntity.CMS,
    entityLabel: "General",
    listLabel: "General",
  },
];

export type CustomField = ArrayElement<
  TAdminCmsSettingsType["customFields"]
>;

export type CustomEntityFormType = TAdminCustomEntity & {
  customFields: CustomField[];
};

export const DefaultEntitySettingsPage = ({ entityType = "CMS"}) => {
  const { adminSettings } = useAdminSettings();
  const params = useParams<{ entityType?: string }>();
  const entity = entities.find(k => k.entityType === entityType)
  console.log(entity, params, entities);
  return (
    <DefaultEntityForm
      entity={entity}
    />
  );
};

const DefaultEntityForm = ({
  entity,
}: {
  entity: TAdminCustomEntity;
}) => {
  const { adminSettings, saveDefaultEntity } =
    useAdminSettings();
  const methods = useForm<CustomEntityFormType>({
    defaultValues: {
      ...entity,
      customFields: adminSettings.customFields?.filter(
        (k) => k.entityType === entity.entityType,
      ),
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
  } = methods;

  const entityLabel = watch(
    "entityLabel",
    entity.entityLabel,
  );

  const entityType = watch("entityType", entity.entityType);

  const onSubmit = async (data: CustomEntityFormType) => {
    const { customFields = [], ...inputs } = data;
    const updatedFields = customFields.map((field, idx) => {
      return {
        ...field,
        entityType: inputs.entityType,
        order: idx,
      };
    });
    const saved = await saveDefaultEntity(
      entity.entityType,
      updatedFields,
    );

    if (saved) {
      reset(data);
    }
  };

  const dirtyCustomFields =
    !!formState.dirtyFields.customFields;

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
            <ActionButton
              disabled={!formState.isDirty}
              type="submit"
              uppercase
              bold>
              save
            </ActionButton>
          </div>
        </div>
        <div className="flex flex-col gap-2 relative lg:flex-row lg:gap-6">
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
              <DraggableEntityFields
                entityType={entityType}
              />
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
