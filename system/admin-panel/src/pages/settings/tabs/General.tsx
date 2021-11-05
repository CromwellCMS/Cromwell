import { EDBEntity } from '@cromwell/core';
import { FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import React from 'react';

import { ImagePicker } from '../../../components/imagePicker/ImagePicker';
import { languages } from '../../../constants/languages';
import { timezones } from '../../../constants/timezones';
import { RenderCustomFields } from '../../../helpers/customFields';
import { TTabProps } from '../Settings';
import styles from '../Settings.module.scss';

export default function General(props: TTabProps) {
    const { settings, handleTextFieldChange, changeSettings } = props;
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
                <FormControl className={styles.field} fullWidth>
                    <TextField label="Website URL"
                        value={settings?.url ?? ''}
                        className={styles.textField}
                        fullWidth
                        variant="standard"
                        onChange={handleTextFieldChange('url')}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl className={styles.field} fullWidth>
                    <InputLabel>Timezone</InputLabel>
                    <Select
                        fullWidth
                        variant="standard"
                        value={settings?.timezone ?? 0}
                        onChange={(event: SelectChangeEvent<unknown>) => {
                            changeSettings('timezone', parseInt(event.target.value as string));
                        }}
                    >
                        {timezones.map(timezone => (
                            <MenuItem value={timezone.value} key={timezone.value}>{timezone.text}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl className={styles.field} fullWidth>
                    <InputLabel>Language</InputLabel>
                    <Select
                        disabled
                        fullWidth
                        variant="standard"
                        className={styles.field}
                        value={settings?.language ?? 'en'}
                        onChange={(event: SelectChangeEvent<unknown>) => {
                            changeSettings('language', event.target.value);
                        }}
                    >
                        {languages.map(lang => (
                            <MenuItem value={lang.code} key={lang.code}>{lang.name} ({lang.nativeName})</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}></Grid>
            <Grid item xs={12} sm={6}>
                <ImagePicker
                    label="Logo"
                    onChange={(val) => changeSettings('logo', val)}
                    value={settings?.logo}
                    className={styles.imageField}
                    backgroundSize='80%'
                    showRemove
                />
            </Grid>
            <Grid item xs={12} sm={6}
                style={{ display: 'flex', alignItems: 'flex-end' }}
            >
                <ImagePicker
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
    )
}
