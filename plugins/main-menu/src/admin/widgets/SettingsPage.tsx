import { PluginSettingsLayout } from '@cromwell/admin-panel';
import { TPluginSettingsProps } from '@cromwell/core';
import { MenuItem } from '@material-ui/core';
import React from 'react';

import { useForceUpdate } from '../../helpers';
import { TMainMenuSettings } from '../../types';
import { AddIcon } from '../icons';
import { useStyles } from '../styles';
import { Item } from './components/MenuItem';

export function SettingsPage(props: TPluginSettingsProps<TMainMenuSettings>) {
    const classes = useStyles();
    const forceUpdate = useForceUpdate();

    return (
        <PluginSettingsLayout<TMainMenuSettings> {...props}>
            {({ pluginSettings, changeSetting }) => (
                <>
                    <h2>Menu items</h2>
                    <div className={classes.itemList}>
                        {pluginSettings?.items?.map((data, i) => {
                            return <Item i={i} updateList={forceUpdate} items={pluginSettings.items} />
                        })}
                    </div>
                    <div className={`${classes.card} ${classes.paper}`}>
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

