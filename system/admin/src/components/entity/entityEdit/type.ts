import { TBasePageEntity } from '@cromwell/core';
import { SxProps } from '@mui/material';

import { TBaseEntityFilter, TEditField, TEntityPageProps } from '../types';

export type TEntityEditProps<
  TEntityType extends TBasePageEntity,
  TFilterType extends TBaseEntityFilter,
  TEntityInputType = TEntityType,
> = TEntityPageProps<TEntityType, TFilterType, TEntityInputType> & {
  fields?: TEditField<TEntityType>[];
  onSave?: (entity: Omit<TEntityType, 'id'>) => Promise<Omit<TEntityType, 'id'>>;
  classes?: {
    fields?: string;
  };
  styles?: {
    fields?: SxProps;
  };
};
