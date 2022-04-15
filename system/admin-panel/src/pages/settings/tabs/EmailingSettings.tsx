import { Grid, TextField } from '@mui/material';
import React from 'react';

// import { TTabProps } from '../Settings';
import styles from '../Settings.module.scss';

export default function EmailingSettings(props: any) {
    const { settings, handleTextFieldChange } = props;

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6} >
                <TextField
                    fullWidth
                    label="Send e-mails from"
                    value={settings?.sendFromEmail ?? ''}
                    onChange={handleTextFieldChange('sendFromEmail')}
                    className={styles.field}
                    variant="standard"
                />
            </Grid>
            <Grid item xs={12} >
                <TextField
                    fullWidth
                    label="SMTP Connection String"
                    value={settings?.smtpConnectionString ?? ''}
                    onChange={handleTextFieldChange('smtpConnectionString')}
                    className={styles.field}
                    variant="standard"
                />
            </Grid>
        </Grid>
    )
}