import { PluginSettingsLayout, TextFieldWithTooltip } from '@cromwell/admin-panel';
import { TPluginSettingsProps } from '@cromwell/core';
import { getRestApiClient } from '@cromwell/core-frontend';
import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import React from 'react';

import { defaultSettings } from '../../constants';
import { TProductFilterSettings } from '../../types';

export function SettingsPage(props: TPluginSettingsProps<TProductFilterSettings>) {
  const onSave = () => {
    getRestApiClient().purgeRendererEntireCache({ disableLog: true }).catch(console.error);
  };

  return (
    <PluginSettingsLayout<TProductFilterSettings> {...props} onSave={onSave}>
      {({ pluginSettings, changeSetting }) => {
        const mobileIconPosition = pluginSettings?.mobileIconPosition ?? defaultSettings.mobileIconPosition;
        const collapsedByDefault = pluginSettings?.collapsedByDefault ?? defaultSettings.collapsedByDefault;
        const mobileCollapsedByDefault =
          pluginSettings?.mobileCollapsedByDefault ?? defaultSettings.mobileCollapsedByDefault;
        return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <TextFieldWithTooltip
              label="List ID"
              tooltipText="ID of a CList component on the page. See in the source code of a Theme or ask its author"
              value={pluginSettings?.listId ?? ''}
              style={{ marginBottom: '15px', marginRight: '15px', maxWidth: '450px' }}
              onChange={(e) => changeSetting('listId', e.target.value)}
            />
            <TextFieldWithTooltip
              label="Mobile breakpoint (px)"
              tooltipText="Width of the browser window in pixels that triggers mobile device mode where will be displayed only small icon that invokes filter modal pop-up"
              value={(pluginSettings?.mobileBreakpoint ?? 600) + ''}
              style={{ marginBottom: '15px', marginRight: '15px', maxWidth: '450px' }}
              onChange={(e) => {
                const num = Number(e.target.value);
                if (!isNaN(num)) changeSetting('mobileBreakpoint', num);
              }}
            />
            <h3 style={{ marginBottom: '15px', marginTop: '20px' }}>Mobile icon position (in pixels):</h3>
            <TextField
              label="Top"
              value={mobileIconPosition.top}
              style={{ marginBottom: '15px', marginRight: '15px', maxWidth: '150px' }}
              onChange={(e) =>
                changeSetting('mobileIconPosition', {
                  ...mobileIconPosition,
                  top: parseInt(e.target.value),
                })
              }
              variant="standard"
            />
            <TextField
              label="Left"
              value={mobileIconPosition.left}
              style={{ marginBottom: '15px', maxWidth: '150px' }}
              onChange={(e) =>
                changeSetting('mobileIconPosition', {
                  ...mobileIconPosition,
                  left: parseInt(e.target.value),
                })
              }
              variant="standard"
            />
            <h3 style={{ marginBottom: '10px', marginTop: '10px' }}>Options visibility</h3>
            <FormControlLabel
              control={
                <Checkbox
                  checked={collapsedByDefault}
                  onChange={() => changeSetting('collapsedByDefault', !collapsedByDefault)}
                  color="primary"
                />
              }
              label="All options collapsed by default at desktop screen"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={mobileCollapsedByDefault}
                  onChange={() => changeSetting('mobileCollapsedByDefault', !mobileCollapsedByDefault)}
                  color="primary"
                />
              }
              label="All options collapsed by default at mobile screen"
            />
          </div>
        );
      }}
    </PluginSettingsLayout>
  );
}
