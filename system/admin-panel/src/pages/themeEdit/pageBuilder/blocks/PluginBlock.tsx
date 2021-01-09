import { Tooltip } from '@material-ui/core';
import { Power as PowerIcon } from '@material-ui/icons';
import React from 'react';

import { BaseBlock } from './BaseBlock';

export class PluginBlock extends BaseBlock {

    render() {
        return (
            <>
                {this.getBaseMenu((
                    <Tooltip title="Plugin block">
                        <PowerIcon />
                    </Tooltip>
                ))}
                <p>Plugin {this.props.block?.getData()?.plugin?.pluginName}</p>
            </>
        );
    }
}
