import { TBasePageEntity } from '@cromwell/core';
import {
  getCheckboxField,
  getColorField,
  getCustomField,
  getDatepickerField,
  getGalleryField,
  getImageField,
  getSelectField,
  getSimpleTextField,
  getTextEditorField,
  TFieldDefaultComponent,
} from '@helpers/customFields';
import React from 'react';

import { TBaseEntityFilter, TEditField, TFieldsComponentProps } from '../types';
import { TEntityEditProps } from './type';

export const setValueOfTextEditorField = (value?: string | null) => {
  let data: {
    html: string;
    json: any;
  } | null = null;
  try {
    if (value) {
      data = JSON.parse(value);
    }
  } catch (error) {
    console.error(error);
  }
  return {
    description: data?.html || null,
    descriptionDelta: data?.json ? JSON.stringify(data?.json) : data?.json || null,
  };
};

export const getInitialValueOfTextEditorField = (value: any, entityData: any) =>
  JSON.stringify({
    html: entityData.description,
    json: entityData.descriptionDelta ? JSON.parse(entityData.descriptionDelta) : undefined,
  });

export type EntityEditContextType<
  TEntityType extends TBasePageEntity,
  TFilterType extends TBaseEntityFilter,
  TEntityInputType = TEntityType,
> = {
  pageProps: TEntityEditProps<TEntityType, TFilterType, TEntityInputType>;
  fieldProps: TFieldsComponentProps<TEntityType>;
};

export const EntityEditContext = React.createContext<EntityEditContextType<TBasePageEntity, TBaseEntityFilter>>(
  {} as any,
);

export function EntityEditContextProvider<
  TEntityType extends TBasePageEntity,
  TFilterType extends TBaseEntityFilter,
  TEntityInputType = TEntityType,
>({
  value,
  children,
}: {
  value: EntityEditContextType<TEntityType, TFilterType, TEntityInputType>;
  children: React.ReactNode;
}) {
  return <EntityEditContext.Provider value={value as any}>{children}</EntityEditContext.Provider>;
}

function getIdFromField<TEntityType extends TBasePageEntity>(field: TEditField<TEntityType>, entityCategory: string) {
  return `${entityCategory}_${field.key}`;
}

export function getCachedField<TEntityType extends TBasePageEntity>(
  field: TEditField<TEntityType>,
  entityCategory: string,
):
  | {
      component: TFieldDefaultComponent;
      saveData: () => string | Promise<string>;
      value?: any;
    }
  | undefined {
  if (field.type === 'Simple text') {
    return getSimpleTextField({
      ...field,
      id: getIdFromField(field, entityCategory),
    });
  }
  if (field.type === 'Currency') {
    return getSimpleTextField({
      simpleTextType: 'currency',
      ...field,
      id: getIdFromField(field, entityCategory),
    });
  }
  if (field.type === 'Text editor') {
    return getTextEditorField({
      ...field,
      id: getIdFromField(field, entityCategory),
    });
  }
  if (field.type === 'Select') {
    return getSelectField({
      ...field,
      id: getIdFromField(field, entityCategory),
    });
  }
  if (field.type === 'Image') {
    return getImageField({
      ...field,
      id: getIdFromField(field, entityCategory),
    });
  }
  if (field.type === 'Gallery') {
    return getGalleryField({
      ...field,
      id: getIdFromField(field, entityCategory),
    });
  }
  if (field.type === 'Color') {
    return getColorField({
      ...field,
      id: getIdFromField(field, entityCategory),
    });
  }
  if (field.type === 'Checkbox') {
    return getCheckboxField({
      ...field,
      id: getIdFromField(field, entityCategory),
    });
  }
  if (field.type === 'Date') {
    return getDatepickerField({
      ...field,
      id: getIdFromField(field, entityCategory),
    });
  }
  if (field.type === 'Datetime') {
    return getDatepickerField({
      dateType: 'datetime',
      ...field,
      id: getIdFromField(field, entityCategory),
    });
  }
  if (field.type === 'custom') {
    return getCustomField({
      ...field,
      id: getIdFromField(field, entityCategory),
    });
  }
}
