import { render, screen } from '@testing-library/react';
import React from 'react';

jest.doMock('@cromwell/admin-panel', () => {
  return {
    PluginSettingsLayout: (props) => props.children({ pluginSettings: props.pluginSettings }),
  };
});

import { SettingsPage } from '../../src/admin/widgets/SettingsPage';

describe('admin widget', () => {
  it('renders settings', async () => {
    render(
      <SettingsPage
        pluginName="main-menu"
        pluginSettings={{
          items: [
            {
              title: '_test1_',
              href: '#_test1_',
            },
          ],
        }}
      />,
    );

    await screen.findByText('_test1_');
  });
});
