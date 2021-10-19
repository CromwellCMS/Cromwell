import { TPluginEntity } from '@cromwell/core';
import { AdminPanelWidgetPlace } from '@cromwell/core-frontend';
import { Public as PublicIcon } from '@mui/icons-material';
import { Autocomplete, TextField, Tooltip } from '@mui/material';
import React from 'react';

import { PluginIcon } from '../../../../constants/icons';
import { useForceUpdate } from '../../../../helpers/forceUpdate';
import { StylesEditor } from '../components/StylesEditor';
import styles from './BaseBlock.module.scss';
import { TBlockMenuProps } from './BlockMenu';


export function PluginBlockSidebar(props: TBlockMenuProps) {
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

    const handleChangeInstanceSettings = (settings: any) => {
        if (!data.plugin) data.plugin = {};
        data.plugin.instanceSettings = settings;
        props?.modifyData?.(data);
        forceUpdate?.();
    }

    return (
        <div>
            <div className={styles.settingsHeader}>
                <PluginIcon className={styles.customIcon} />
                {props.isGlobalElem(props.getBlockElementById(data?.id)) && (
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
            {pluginInfo?.name && (
                <AdminPanelWidgetPlace
                    widgetName="ThemeEditor"
                    pluginName={pluginInfo?.name}
                    widgetProps={{
                        ...props,
                        forceUpdate,
                        instanceSettings: data?.plugin?.instanceSettings ?? {},
                        changeInstanceSettings: handleChangeInstanceSettings,
                    }}
                />
            )}
            <StylesEditor
                forceUpdate={forceUpdate}
                blockProps={props}
            />
        </div>
    );
}

