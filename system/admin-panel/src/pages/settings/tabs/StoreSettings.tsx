import { Grid, TextField } from '@mui/material';
import React from 'react';

import { NumberFormatCustom } from '../../../helpers/NumberFormatCustom';
import { TTabProps } from '../Settings';
import styles from '../Settings.module.scss';

export default function StoreCurrencies(props: TTabProps) {
    const { settings, handleTextFieldChange } = props;
    return (
        <Grid item container spacing={3}>
            <Grid item xs={12} sm={6}>
                <TextField label="Standard shipping price"
                    value={settings?.defaultShippingPrice ?? 0}
                    className={styles.textField}
                    variant="standard"
                    fullWidth
                    InputProps={{
                        inputComponent: NumberFormatCustom as any,
                    }}
                    onChange={handleTextFieldChange('defaultShippingPrice')}
                />
            </Grid>
        </Grid>
    )
}