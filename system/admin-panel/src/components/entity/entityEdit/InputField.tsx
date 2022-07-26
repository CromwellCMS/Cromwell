import { TBasePageEntity } from '@cromwell/core';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Grid, Tooltip } from '@mui/material';
import React from 'react';

import { TFieldDefaultComponent } from '../../../helpers/customFields';
import { useForceUpdate } from '../../../helpers/forceUpdate';

export function InputField({ field, fieldCache, canValidate, entityData }: {
  field
  fieldCache
  canValidate?: boolean;
  entityData: TBasePageEntity;
}) {
  const forceUpdate = useForceUpdate();

  const Component: TFieldDefaultComponent | undefined = fieldCache?.component;
  const error = field.required && (fieldCache?.value === null
    || fieldCache?.value === undefined || fieldCache?.value === '');

  if (!Component) return null;
  if (field.onlyOnCreate && entityData?.id) return null;

  return (
    <Grid item
      xs={field.width?.xs ?? 12}
      sm={field.width?.sm ?? 12}
      key={field.key}>
      <Component entity={entityData}
        options={field.options}
        initialValue={field.getInitialValue ?
          field.getInitialValue(entityData[field.key], entityData) : entityData[field.key]}
        canValidate={canValidate}
        error={error}
        onChange={forceUpdate}
      />
      {field?.tooltip && (
        <Tooltip title={field?.tooltip}>
          <InfoOutlinedIcon style={{ width: '1.25rem', height: '1.25rem' }} />
        </Tooltip>
      )}
    </Grid>
  )
}