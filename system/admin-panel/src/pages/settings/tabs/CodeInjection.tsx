import { Grid, TextField } from '@mui/material';
import React from 'react';

// import { TTabProps } from '../Settings';
import styles from '../Settings.module.scss';

export default function CodeInjection(props: any) {
  const { settings, handleTextFieldChange } = props;
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Head HTML"
          multiline
          maxRows={20}
          value={settings?.headHtml ?? ''}
          onChange={handleTextFieldChange('headHtml')}
          variant="outlined"
          className={styles.field}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Footer HTML"
          multiline
          maxRows={20}
          value={settings?.footerHtml ?? ''}
          onChange={handleTextFieldChange('footerHtml')}
          variant="outlined"
          className={styles.field}
        />
      </Grid>
    </Grid>
  );
}
