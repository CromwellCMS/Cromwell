import { Grid } from '@mui/material';
import React, { useContext } from 'react';

import { EntityEditContext, getCachedField } from '../helpers';
import { EntityCustomFields } from './EntityCustomFields';
import { EntityMetaFields } from './EntityMetaFields';
import { InputField } from './InputField';

export function EntityFields() {
  const {
    pageProps: { customElements, fields, entityCategory },
    fieldProps,
  } = useContext(EntityEditContext);

  const { isLoading, entityData, canValidate } = fieldProps;

  if (!entityData || isLoading) return null;

  if (customElements?.getEntityFields) {
    // Custom render
    return customElements.getEntityFields(fieldProps);
  }

  // Default render
  return (
    <Grid container spacing={3}>
      {fields?.map((field) => {
        const fieldCache = getCachedField(field, entityCategory);
        return (
          <InputField
            key={field.key}
            fieldCache={fieldCache}
            field={field}
            canValidate={canValidate}
            entityData={entityData}
          />
        );
      })}
      <Grid item xs={12}></Grid>
      <EntityCustomFields />
      <EntityMetaFields />
    </Grid>
  );
}
