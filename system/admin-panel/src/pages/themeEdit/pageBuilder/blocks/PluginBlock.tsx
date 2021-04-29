import { TPluginEntity } from '@cromwell/core';
import { getBlockElementById } from '@cromwell/core-frontend';
import { TextField, Tooltip } from '@material-ui/core';
import { Power as PowerIcon, Public as PublicIcon } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import React from 'react';

import { useForceUpdate } from '../../../../helpers/forceUpdate';
import styles from './BaseBlock.module.scss';
import { BaseMenu, TBaseMenuProps } from './BaseMenu';

export function PluginBlockReplacer(props: TBaseMenuProps) {
    const pluginInfo = props.plugins?.find(p => p.name === props.block?.getData()?.plugin?.pluginName);
    return (
        <>
            <BaseMenu
                {...props}
                icon={(
                    <Tooltip title="Plugin block">
                        <PowerIcon />
                    </Tooltip>
                )}
            />
            <div className={styles.pluginText}>{pluginInfo?.name ? (
                <p><b>{pluginInfo?.title}</b> plugin [{pluginInfo?.name}]</p>
            ) : (
                    <p>plugin block</p>
                )}</div>
        </>
    );
}

export function PluginBlockSidebar(props: TBaseMenuProps) {
    const data = props.block?.getData();
    const pluginInfo = props.plugins?.find(p => p.name === data?.plugin?.pluginName);
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
        <div>
            <div className={styles.settingsHeader}>
                <PowerIcon />
                {props.isGlobalElem(getBlockElementById(data?.id)) && (
                    <div className={styles.headerIcon}>
                        <Tooltip title="Global block">
                            <PublicIcon />
                        </Tooltip>
                    </div>
                )}
                <h3 className={styles.settingsTitle}>Plugin settings</h3>
            </div>
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
    );
}

