import { PluginSettingsLayout, TextFieldWithTooltip } from '@cromwell/admin-panel';
import { TPluginSettingsProps } from '@cromwell/core';
import { registerWidget } from '@cromwell/core-frontend';
import React from 'react';

import { pluginName } from '../constants';
import { SettingsType } from '../types';

function SettingsPage(props: TPluginSettingsProps<SettingsType>) {
    return (
        <PluginSettingsLayout<SettingsType> {...props}>
            {({ pluginSettings, changeSetting }) => (
                <>
                    <TextFieldWithTooltip
                        tooltipText="https://stripe.com/docs/keys"
                        tooltipLink="https://stripe.com/docs/keys"
                        label="Stripe Secret API Key"
                        value={pluginSettings?.stripeApiKey ?? ''}
                        fullWidth
                        onChange={(event) => changeSetting('stripeApiKey', event.target.value)}
                    />
                </>
            )}
        </PluginSettingsLayout>
    )
}

registerWidget({
    pluginName,
    widgetName: 'PluginSettings',
    component: SettingsPage
});