import { getCustomMetaKeysFor, RenderCustomFields } from '@helpers/customFields';
import { Grid } from '@mui/material';
import React, { useContext } from 'react';

import { EntityEditContext } from '../helpers';

function CustomFieldWrapper({ children }) {
  return (
    <Grid item xs={12}>
      {children}
    </Grid>
  );
}

export function EntityCustomFields() {
  const {
    pageProps: { entityType, entityCategory },
    fieldProps: { entityData, refetchMeta },
  } = useContext(EntityEditContext);

  if (!entityData || !getCustomMetaKeysFor(entityType ?? entityCategory).length) return null;

  return (
    <RenderCustomFields
      FieldWrapper={CustomFieldWrapper}
      entityType={entityType ?? entityCategory}
      entityData={entityData}
      refetchMeta={refetchMeta}
    />
  );
}
