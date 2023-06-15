import { PluginSettingsLayout, SelectInput, SwitchInput, TextFieldWithTooltip } from '@cromwell/admin-panel';
import { TPluginSettingsProps } from '@cromwell/core';
import React from 'react';

import { SettingsType } from '../../types';

export function SettingsPage(props: TPluginSettingsProps<SettingsType>) {
  return (
    <PluginSettingsLayout<SettingsType> {...props}>
      {({ pluginSettings, changeSetting }) => (
        <>
          <TextFieldWithTooltip
            sx={{ mb: 4 }}
            tooltipText="Paypal docs"
            tooltipLink="https://developer.paypal.com/docs/api-basics/manage-apps/"
            label="Paypal client id"
            value={pluginSettings?.client_id ?? ''}
            fullWidth
            onChange={(event) => changeSetting('client_id', event.target.value)}
          />
          <TextFieldWithTooltip
            sx={{ mb: 4 }}
            tooltipText="Paypal docs"
            tooltipLink="https://developer.paypal.com/docs/api-basics/manage-apps/"
            label="Paypal client secret"
            value={pluginSettings?.client_secret ?? ''}
            fullWidth
            onChange={(event) => changeSetting('client_secret', event.target.value)}
          />
          <SelectInput
            label="Paypal Mode"
            value={pluginSettings?.mode ?? 'sandbox'}
            onChange={(value) => changeSetting('mode', value as any)}
            sx={{ mb: 4, minWidth: 200 }}
            // tooltipText="Paypal mode"
            // tooltipLink="https://developer.paypal.com/docs/api-basics/sandbox/"
            options={[
              {
                label: 'Sandbox',
                value: 'sandbox',
              },
              {
                label: 'Live',
                value: 'live',
              },
            ]}
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
