import { PluginSettingsLayout } from '@cromwell/admin-panel';
import { TPluginSettingsProps } from '@cromwell/core';
import { createStyles, makeStyles, TextField } from '@material-ui/core';
import React from 'react';

import { TSettings } from '../types';

export function SettingsPage(props: TPluginSettingsProps<TSettings>) {
    const classes = useStyles();

    return (
        <PluginSettingsLayout<TSettings> {...props}>
            {({ pluginSettings, changeSetting }) => {
                const size = pluginSettings?.size ?? 20;

                const handleChangeSize = (event: any) => {
                    const valInt = parseInt(event.target.value);
                    if (!isNaN(valInt)) {
                        changeSetting('size', valInt)
                    }
                }

                return (
                    <>
                        <p>If used on Product page, displays products from same categories.</p>
                        <p>Displays random products on other pages.</p>
                        <div>
                            <TextField
                                label={'Items in carousel'}
                                className={classes.item}
                                value={size}
                                onChange={handleChangeSize}
                            />
                        </div>
                    </>
                )
            }}
        </PluginSettingsLayout>
    )
}

const useStyles = makeStyles(() =>
    createStyles({
        content: {
            width: '100%',
            maxWidth: '900px',
            margin: '0 auto',
        },
        paper: {
            boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.04), 0 0 10px 3px rgba(0, 0, 0, 0.05)',
            backgroundColor: '#fff',
            borderRadius: '5px',
            padding: '20px',
        },
        item: {
            display: 'block',
            margin: '20px 0'
        }
    }),
);