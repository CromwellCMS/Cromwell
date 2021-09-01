import { TextFieldWithTooltip } from '@cromwell/admin-panel';
import { TCromwellBlockData } from '@cromwell/core';
import { WidgetTypes } from '@cromwell/core-frontend';
import React from 'react';

export function ThemeEditor(props: WidgetTypes['ThemeEditor']) {
    const blockData = props.data?.block?.getData() ?? {} as TCromwellBlockData;

    const handleChangeListId = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!blockData.plugin) blockData.plugin = {};
        if (!blockData.plugin.instanceSettings) blockData.plugin.instanceSettings = {};

        blockData.plugin.instanceSettings.listId = event.target.value;
        props.data?.modifyData?.(blockData);
        props.data?.forceUpdate?.();
    }

    return (
        <div>
            <TextFieldWithTooltip label="List ID"
                tooltipText="ID of a CList component on the page. See in the source code of a Theme or ask its author"
                value={blockData?.plugin?.instanceSettings?.listId ?? ''}
                style={{ marginBottom: '15px', marginRight: '15px' }}
                onChange={handleChangeListId}
                fullWidth
            />
        </div>
    )
}
