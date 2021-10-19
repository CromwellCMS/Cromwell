import { PluginSettingsLayout } from '@cromwell/admin-panel';
import { TPluginSettingsProps } from '@cromwell/core';
import { getRestApiClient } from '@cromwell/core-frontend';
import { MenuItem } from '@mui/material';
import React from 'react';

import { useForceUpdate } from '../../helpers';
import { TMainMenuSettings } from '../../types';
import { AddIcon } from '../icons';
import { useStyles } from '../styles';
import { Item } from './components/MenuItem';

export function SettingsPage(props: TPluginSettingsProps<TMainMenuSettings>) {
    const classes = useStyles();
    const forceUpdate = useForceUpdate();

    const onSave = () => {
        getRestApiClient().purgeRendererEntireCache();
    }

    return (
        <PluginSettingsLayout<TMainMenuSettings> {...props} onSave={onSave}>
            {({ pluginSettings, changeSetting }) => (
                <>
                    <h2>Menu items</h2>
                    <div className={classes.itemList}>
                        {pluginSettings?.items?.map((data, i) => {
                            return <Item i={i} updateList={forceUpdate} items={pluginSettings.items} />
                        })}
                    </div>
                    <div className={`${classes.card} PluginMainMenu-paper`}>
                        <MenuItem
                            className={classes.addBtn}
                            onClick={() => changeSetting('items',
                                [...(pluginSettings?.items ?? []), { title: '' }]
                            )}>
                            <AddIcon />
                        </MenuItem>
                    </div>
                </>
            )}
        </PluginSettingsLayout>
    )
}

