import { Tooltip } from '@material-ui/core';
import { Code as CodeIcon } from '@material-ui/icons';
import React from 'react';

import { BaseMenu, TBaseMenuProps } from './BaseMenu';

export function HTMLBlock(props: TBaseMenuProps) {
    return (
        <>
            <BaseMenu
                {...props}
                icon={(
                    <Tooltip title="HTML block">
                        <CodeIcon />
                    </Tooltip>
                )}
            />
            {props.block?.getDefaultContent()}
        </>
    );
}
