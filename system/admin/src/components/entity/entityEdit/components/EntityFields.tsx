import { Grid, Box } from '@mui/material';
import clsx from 'clsx';
import React, { useContext } from 'react';

import { EntityEditContext, getCachedField } from '../helpers';
import { EntityCustomFields } from './EntityCustomFields';
import { EntityMetaFields } from './EntityMetaFields';
import { InputField } from './InputField';
import defaultStyles from '../EntityEdit.module.scss';

export function EntityFields() {
  const {
    pageProps: { customElements, fields, entityCategory, classes, styles },
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
    <Box className={clsx(defaultStyles.fields, classes?.fields)} sx={styles?.fields}>
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
    </Box>
  );
}
