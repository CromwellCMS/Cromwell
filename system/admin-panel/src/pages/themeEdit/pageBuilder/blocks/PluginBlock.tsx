import { TPluginEntity } from '@cromwell/core';
import { TextField, Tooltip } from '@material-ui/core';
import { Power as PowerIcon } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import React, { useState } from 'react';

import { useForceUpdate } from '../../../../helpers/forceUpdate';
import styles from './BaseBlock.module.scss';
import { BaseMenu, TBaseMenuProps } from './BaseMenu';

export function PluginBlock(props: TBaseMenuProps) {
    const pluginInfo = props.plugins?.find(p => p.name === props.block?.getData()?.plugin?.pluginName);
    const forceUpdate = useForceUpdate();

    const handleChange = (event: any, newValue: TPluginEntity | null) => {
        if (newValue?.name) {
            const data = props.block?.getData();
            if (!data.plugin) data.plugin = {};
            data.plugin.pluginName = newValue.name;
            props.modifyData?.(data);
            forceUpdate();
        }
    }

    const getPluginLabel = (entity: TPluginEntity) => {
        return `${entity?.title} [${entity?.name}]`
    }

    return (
        <>
            <BaseMenu
                {...props}
                icon={(
                    <Tooltip title="Plugin block">
                        <PowerIcon />
                    </Tooltip>
                )}
                settingsContent={(
                    <div>
                        <h3 className={styles.settingsTitle}>Plugin settings</h3>
                        <Autocomplete
                            onChange={handleChange}
                            options={props.plugins ?? []}
                            value={(props.plugins ?? []).find(p => p.name === pluginInfo?.name)}
                            getOptionLabel={(option) => getPluginLabel(option)}
                            renderInput={(params) => <TextField {...params}
                                placeholder="Plugin"
                            />}
                        />
                    </div>
                )}
            />
            {pluginInfo?.name ? (
                <p><b>{pluginInfo?.title}</b> plugin [{pluginInfo?.name}]</p>
            ) : (
                <p>plugin block</p>
            )}
        </>
    );
}

