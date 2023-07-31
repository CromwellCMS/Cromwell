import { TAdminCustomField, TBasePageEntity } from '@cromwell/core';

export type TRegisteredCustomField = TAdminCustomField & {
  component: React.ComponentType<{
    initialValue: string | undefined | null;
    entity: TBasePageEntity;
    onChange?: (value: any) => void;
  }>;
  saveData: () => string | Promise<string>;
};

export type TFieldDefaultComponent = React.ComponentType<{
  initialValue: string | undefined;
  entity: TBasePageEntity;
  canValidate?: boolean;
  error?: boolean;
  options?: (
    | {
        value: string | number | undefined;
        label: string;
      }
    | string
    | number
    | undefined
  )[];
  onChange?: (value: any) => void;
}>;
