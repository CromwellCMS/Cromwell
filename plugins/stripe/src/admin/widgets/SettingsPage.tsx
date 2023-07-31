import { PluginSettingsLayout, SwitchInput, TextFieldWithTooltip } from '@cromwell/admin-panel';
import { TPluginSettingsProps } from '@cromwell/core';
import React from 'react';

import { SettingsType } from '../../types';

export function SettingsPage(props: TPluginSettingsProps<SettingsType>) {
  return (
    <PluginSettingsLayout<SettingsType> {...props}>
      {({ pluginSettings, changeSetting }) => (
        <>
          <TextFieldWithTooltip
            tooltipText="https://stripe.com/docs/keys"
            tooltipLink="https://stripe.com/docs/keys"
            label="Stripe Secret API Key"
            sx={{ mb: 4 }}
            value={pluginSettings?.stripeApiKey ?? ''}
            fullWidth
            onChange={(event) => changeSetting('stripeApiKey', event.target.value)}
          />
          <SwitchInput
            sx={{ mb: 4 }}
            label="Enabled"
            value={pluginSettings?.enabled}
            onChange={(enabled) => changeSetting('enabled', enabled)}
          />
        </>
      )}
    </PluginSettingsLayout>
  );
}
