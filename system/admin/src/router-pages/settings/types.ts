import { TAdminCustomEntity, TCmsSettings } from '@cromwell/core';

export type TAdminCmsSettingsType = TCmsSettings;

export type CustomField = ArrayElement<TAdminCmsSettingsType['customFields']>;

export type CustomEntityFormType = TAdminCustomEntity & {
  customFields: CustomField[];
};
