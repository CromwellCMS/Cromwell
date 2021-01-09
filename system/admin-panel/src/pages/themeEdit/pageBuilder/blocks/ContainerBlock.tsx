import { Tooltip } from '@material-ui/core';
import { Widgets as WidgetsIcon } from '@material-ui/icons';
import React from 'react';
import { BaseBlock } from './BaseBlock';

export class ContainerBlock extends BaseBlock {

    render() {
        return (
            <>
                {this.getBaseMenu((
                    <Tooltip title="Container block">
                        <WidgetsIcon />
                    </Tooltip>
                ))}
                {this.props.block?.getDefaultContent()}
            </>
        );
    }
}
