import { TextField } from '@mui/material';
import { render, screen } from '@testing-library/react';
import React from 'react';

jest.doMock('@cromwell/admin-panel', () => {
  return {
    PluginSettingsLayout: (props) => props.children({ pluginSettings: props.pluginSettings }),
    TextFieldWithTooltip: (props) => <TextField {...props} />,
  };
});

import { SettingsPage } from '../../src/admin/widgets/SettingsPage';

describe('SettingsPage', () => {
  it('renders settings', async () => {
    render(
      <SettingsPage
        pluginName="main-menu"
        pluginSettings={{
          stripeApiKey: '_test_',
        }}
      />,
    );

    await screen.getByDisplayValue('_test_');
  });
});
