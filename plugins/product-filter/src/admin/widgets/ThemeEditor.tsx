import { TextFieldWithTooltip } from '@cromwell/admin-panel';
import { WidgetTypes } from '@cromwell/core-frontend';
import React from 'react';

export function ThemeEditor(props: WidgetTypes['ThemeEditor']) {
    const handleChangeListId = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value: any = event.target.value;
        if (value === '') value = undefined;
        props.changeInstanceSettings?.(Object.assign({}, props.instanceSettings, {
            listId: value,
        }));
    }

    return (
        <div>
            <TextFieldWithTooltip label="List ID"
                tooltipText="ID of a CList component on the page. See in the source code of a Theme or ask its author"
                value={props.instanceSettings.listId ?? ''}
                style={{ marginBottom: '15px', marginRight: '15px' }}
                onChange={handleChangeListId}
                fullWidth
            />
        </div>
    )
}
