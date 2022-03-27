import { Public as PublicIcon } from '@mui/icons-material';
import { Autocomplete, TextField, Tooltip } from '@mui/material';
import React, { useEffect } from 'react';

import { PluginIcon } from '../../../../constants/icons';
import { useForceUpdate } from '../../../../helpers/forceUpdate';
import {
    getPluginBlockId,
    getPluginBlocks,
    onPluginBlockRegister,
    TPluginBlockOptions,
} from '../../../../helpers/registerThemeEditor';
import { StylesEditor } from '../components/StylesEditor';
import styles from './BaseBlock.module.scss';
import { TBlockMenuProps } from './BlockMenu';

export function PluginBlockSidebar(props: TBlockMenuProps) {
    const data = props.block?.getData();
    // const pluginInfo = props.plugins?.find(p => p.name === data?.plugin?.pluginName);
    const forceUpdate = useForceUpdate();
    const pluginBlocks = getPluginBlocks();
    const pluginProps: any = props.block.getContentInstance().props;

    const currentId = getPluginBlockId(
        data?.plugin?.pluginName ?? pluginProps.pluginName ?? '',
        data?.plugin?.blockName ?? pluginProps.blockName ?? '',
    );
    const currentBlock = pluginBlocks.find(b => getPluginBlockId(b.pluginName, b.blockName) === currentId);

    useEffect(() => {
        onPluginBlockRegister(() => {
            forceUpdate();
        });
    }, []);

    const handleChange = (event: any, newValue: TPluginBlockOptions | null) => {
        if (newValue?.pluginName && newValue?.blockName) {
            const data = props.block?.getData();
            if (!data.plugin) data.plugin = {};
            data.plugin.pluginName = newValue.pluginName;
            data.plugin.blockName = newValue.blockName;
            props.modifyData?.(data);
            forceUpdate();
        }
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
                options={pluginBlocks ?? []}
                value={(pluginBlocks ?? []).find(p => getPluginBlockId(p.pluginName, p.blockName) === currentId)}
                getOptionLabel={(option) => option.blockName}
                renderInput={(params) => <TextField {...params}
                    placeholder="Plugin"
                />}
            />
            {currentBlock?.component && (
                <currentBlock.component
                    {...{
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

