import { AutocompleteInput } from '@components/inputs/AutocompleteInput';
import { TextInput } from '@components/inputs/TextInput';
import { Grid } from '@mui/material';
import React, { useContext } from 'react';

import styles from '../EntityEdit.module.scss';
import { EntityEditContext } from '../helpers';

export function EntityMetaFields() {
  const {
    pageProps: { disableMeta },
    fieldProps: { frontendUrl, entityData, handleInputChange },
  } = useContext(EntityEditContext);

  if (disableMeta) return null;

  return (
    <>
      <Grid item xs={12}>
        <TextInput
          label="Page URL"
          value={entityData?.slug ?? ''}
          className={styles.defaultField}
          onChange={(e) => {
            handleInputChange('slug', e.target.value);
          }}
          description={frontendUrl}
        />
      </Grid>
      <Grid item xs={12}>
        <TextInput
          label="Meta title"
          value={entityData?.pageTitle ?? ''}
          className={styles.defaultField}
          onChange={(e) => {
            handleInputChange('pageTitle', e.target.value);
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextInput
          label="Meta description"
          value={entityData?.pageDescription ?? ''}
          className={styles.defaultField}
          onChange={(e) => {
            handleInputChange('pageDescription', e.target.value);
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <AutocompleteInput
          multiple
          freeSolo
          options={[]}
          className={styles.defaultField}
          value={entityData?.meta?.keywords ?? []}
          getOptionLabel={(option) => option as any}
          onChange={(e, newVal) => {
            handleInputChange('meta', {
              ...(entityData.meta ?? {}),
              keywords: newVal,
            });
          }}
          label="Meta keywords"
          tooltip="Press ENTER to add"
        />
      </Grid>
    </>
  );
}
