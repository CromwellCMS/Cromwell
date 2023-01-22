import { getCustomMetaKeysFor, RenderCustomFields } from '@helpers/customFields';
import { Grid } from '@mui/material';
import React, { useContext } from 'react';

import { EntityEditContext } from '../helpers';

export function EntityCustomFields() {
  const {
    pageProps: { entityType, entityCategory },
    fieldProps: { entityData, refetchMeta },
  } = useContext(EntityEditContext);

  if (!entityData || !getCustomMetaKeysFor(entityType ?? entityCategory).length) return null;

  return (
    <Grid item xs={12}>
      <RenderCustomFields entityType={entityType ?? entityCategory} entityData={entityData} refetchMeta={refetchMeta} />
    </Grid>
  );
}
