import { render, screen } from '@testing-library/react';
import React from 'react';

jest.doMock('@cromwell/admin-panel', () => {
  return {
    PluginSettingsLayout: (props) => props.children({ pluginSettings: props.pluginSettings }),
    LoadingStatus: () => null,
  };
});

import { SettingsPage } from '../../src/admin/widgets/SettingsPage';

describe('admin settings widget', () => {
  it('renders page', async () => {
    render(<SettingsPage pluginName="newsletter" />);

    await screen.findByText('Export data');
  });
});
