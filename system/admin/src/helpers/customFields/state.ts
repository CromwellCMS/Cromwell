import { EDBEntity } from '@cromwell/core';

import { TFieldDefaultComponent, TRegisteredCustomField } from './types';

export const customFields: Record<EDBEntity | string, Record<string, TRegisteredCustomField>> = {};
export const customFieldsForceUpdates: Partial<Record<EDBEntity, () => void>> = {};
export const onFieldRegisterListeners: Record<string, (field: TRegisteredCustomField) => any> = {};

export const fieldsCache: Record<
  string,
  {
    component: TFieldDefaultComponent;
    saveData: () => string | Promise<string>;
    value?: any;
  }
> = {};
