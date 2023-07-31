import { EDBEntity } from '@cromwell/core';

import { customFields, customFieldsForceUpdates, onFieldRegisterListeners } from './state';
import { TRegisteredCustomField } from './types';

export const registerCustomField = (field: TRegisteredCustomField) => {
  if (!customFields[field.entityType]) customFields[field.entityType] = {};
  customFields[field.entityType][field.key] = field;
  customFieldsForceUpdates[field.entityType]?.();
  Object.values(onFieldRegisterListeners).forEach((listener) => listener(field));
};

export const unregisterCustomField = (entityType: string, key: string) => {
  if (customFields[entityType]) {
    delete customFields[entityType][key];
    customFieldsForceUpdates[entityType]?.();
  }
};

export const addOnFieldRegisterEventListener = (id: string, listener: (field: TRegisteredCustomField) => any) => {
  onFieldRegisterListeners[id] = listener;
};
export const removeOnFieldRegisterEventListener = (id: string) => {
  delete onFieldRegisterListeners[id];
};

export const getCustomMetaFor = async (entityType: EDBEntity | string): Promise<Record<string, string>> => {
  return Object.assign(
    {},
    ...(await Promise.all(
      Object.values(customFields[entityType] ?? {}).map(async (field) => {
        return {
          [field.key]: await field.saveData(),
        };
      }),
    )),
  );
};

export const getCustomMetaKeysFor = (entityType: EDBEntity | string): string[] => {
  return Object.values(customFields[entityType] ?? {}).map((field) => field.key);
};

export const getCustomFieldsFor = (entityType: EDBEntity | string): TRegisteredCustomField[] => {
  return Object.values(customFields[entityType] ?? {});
};
