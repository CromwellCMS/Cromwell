import { Tooltip } from '@material-ui/core';
import { Code as CodeIcon } from '@material-ui/icons';
import React from 'react';
import { BaseBlock } from './BaseBlock';

export class HTMLBlock extends BaseBlock {

    render() {
        return (
            <>
                {this.getBaseMenu((
                    <Tooltip title="HTML block">
                        <CodeIcon />
                    </Tooltip>
                ))}
                {this.props.block?.getDefaultContent()}
            </>
        );
    }
}
