import { Tooltip } from '@material-ui/core';
import { Widgets as WidgetsIcon } from '@material-ui/icons';
import React from 'react';

import { BaseMenu, TBaseMenuProps } from './BaseMenu';

export function ContainerBlock(props: TBaseMenuProps) {
    return (
        <>
            <BaseMenu
                {...props}
                icon={(
                    <Tooltip title="Container block">
                        <WidgetsIcon />
                    </Tooltip>
                )}
            />
            {props.block?.getDefaultContent()}
        </>
    );
}
