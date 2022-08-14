import { EDBEntity, TImageSettings } from "@cromwell/core";
import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TextInput } from "../../../components/inputs/TextInput";
import { ImageInput } from "../../../components/inputs/Image/ImageInput";
import { GalleryPicker } from "../../../components/inputs/GalleryInput/GalleryInput";
import { useAdminSettings } from "../../../hooks/useAdminSettings";
import { CustomTextEditorInputField } from "./customTextEditorInputField";
import { RegisteredSelectField } from "./registeredSelectField";

export const CustomFieldSettings = (props: {
  entityType: EDBEntity | string;
  // entityData: TBasePageEntity
}) => {
  const { entityType } = props;
  const { adminSettings } = useAdminSettings();
  const [updatedMeta, setUpdatedMeta] = useState<Record<
    string,
    string
  > | null>(null);
  const { register, watch } = useFormContext();
  // console.log(adminSettings);

  // useEffect(() => {

  // }, [])

  const fields = (adminSettings?.customFields?.filter(
    (k) => k.entityType === entityType,
  ) || []);

  return (
    <>
      {fields
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((field) => {
          if (field.fieldType === "Simple text") {
            return (
              <TextInput
                key={field.id}
                label={field.label}
                {...register(`customMeta.${field.key}`)}
              />
            );
          }

          if (field.fieldType === "Image") {
            return (
              <Controller
                key={field.id}
                name={`customMeta.${field.key}`}
                render={({ field: { value, onChange } }) => {
                  return (
                    <ImageInput
                      key={field.id}
                      id={field.id}
                      label={field.label}
                      value={value}
                      onChange={(v) => onChange(v)}
                      showRemove
                      backgroundSize="cover"
                      className="h-52 col-span-2"
                    />
                  )
                }}
              />

            );
          }

          if (field.fieldType === "Text editor") {
            return (
              <CustomTextEditorInputField
                key={field.id}
                id={field.id}
                name={`customMeta.${field.key}`}
                label={field.label}
              />
            );
          }

          if (field.fieldType === "Color") {
            const overlay = watch(
              `customMeta.${field.key}`,
            );
            return (
              <TextInput
                key={field.id}
                label={field.label}
                overlay={overlay}
                {...register(`customMeta.${field.key}`)}
                type="color"
              />
            );
          }

          if (field.fieldType === "Select") {
            return (
              <RegisteredSelectField
                key={field.id}
                options={field.options}
                name={`customMeta.${field.key}`}
                label={field.label}
              />
            );
          }

          if (field.fieldType === "Gallery") {
            return (
              <div key={field.id} className="my-4 w-full col-span-2">
                <Controller
                  name={`customMeta.${field.key}`}
                  render={({ field: { value, onChange } }) => {
                    const val = value?.split(",").map(src => ({ src })) ?? []
                    return (
                      <GalleryPicker
                        key={field.id}
                        images={val}
                        onChange={(value: TImageSettings[]) => {
                          const valStr = value.length === 0 ? null : value.map(({ src }) => src).join(",");
                          onChange(valStr);
                        }}
                        label={field.label}
                        className=""
                      />
                    )
                  }}
                />
              </div>
            )
          }

          return null;
        })}
    </>
  );
};
