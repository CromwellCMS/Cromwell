import { EDBEntity } from '@cromwell/core';
import { FormControl, Grid, SelectChangeEvent, TextField } from '@mui/material';
import React from 'react';

import { ImageInput } from '../../../components/inputs/Image/ImageInput';
import { Select } from '../../../components/select/Select';
import { languages } from '../../../constants/languages';
import { timezones } from '../../../constants/timezones';
import { RenderCustomFields } from '../../../helpers/customFields';
// import { TTabProps } from '../Settings';
import styles from '../Settings.module.scss';

export default function General(props: any) {
  const { settings, handleTextFieldChange, changeSettings } = props;
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <FormControl className={styles.field} fullWidth>
          <TextField
            label="Website URL"
            value={settings?.url ?? ''}
            className={styles.textField}
            fullWidth
            variant="standard"
            onChange={handleTextFieldChange('url')}
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Select
          fullWidth
          className={styles.field}
          label="Timezone"
          variant="standard"
          value={settings?.timezone ?? 0}
          onChange={(event: SelectChangeEvent<unknown>) => {
            changeSettings('timezone', parseInt(event.target.value as string));
          }}
          options={timezones.map((timezone) => ({ value: timezone.value, label: timezone.text }))}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Select
          disabled
          fullWidth
          className={styles.field}
          variant="standard"
          label="Language"
          value={settings?.language ?? 'en'}
          onChange={(event: SelectChangeEvent<unknown>) => {
            changeSettings('language', event.target.value);
          }}
          options={languages.map((lang) => ({ value: lang.code, label: `${lang.name} (${lang.nativeName})` }))}
        />
      </Grid>
      <Grid item xs={12} sm={6}></Grid>
      <Grid item xs={12} sm={6}>
        <ImageInput
          label="Logo"
          onChange={(val) => changeSettings('logo', val)}
          value={settings?.logo}
          className={styles.imageField}
          // backgroundSize='80%'
          showRemove
        />
      </Grid>
      <Grid item xs={12} sm={6} style={{ display: 'flex', alignItems: 'flex-end' }}>
        <ImageInput
          label="Favicon"
          onChange={(val) => changeSettings('favicon', val)}
          value={settings?.favicon}
          className={styles.imageField}
          showRemove
        />
      </Grid>
      <Grid item xs={12} sm={12}>
        {settings && (
          <RenderCustomFields
            entityType={EDBEntity.CMS}
            entityData={{ ...settings } as any}
            refetchMeta={async () => settings?.customMeta}
          />
        )}
      </Grid>
    </Grid>
  );
}
