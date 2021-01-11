import { Tooltip } from '@material-ui/core';
import { Power as PowerIcon } from '@material-ui/icons';
import React from 'react';

import { BaseMenu, TBaseMenuProps } from './BaseMenu';

export function PluginBlock(props: TBaseMenuProps) {
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
            <p><b>Plugin </b>[{props.block?.getData()?.plugin?.pluginName}]</p>
        </>
    );
}
