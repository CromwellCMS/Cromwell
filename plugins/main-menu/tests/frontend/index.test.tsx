import { render, screen } from '@testing-library/react';
import React from 'react';

jest.mock('@cromwell/admin-panel', () => {
  return {
    PluginSettingsLayout: (props) => props.children({ pluginSettings: props.pluginSettings }),
  };
});

import MainMenu from '../../src/frontend/index';

describe('frontend plugin', () => {
  it('renders menu items', async () => {
    render(
      <MainMenu
        pluginName="main-menu"
        data={{
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
