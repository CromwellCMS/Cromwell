import { render, screen } from '@testing-library/react';
import { TCmsSettings } from '@cromwell/core';
import React from 'react';
import { languages } from '../../constants/languages';

const testData: TCmsSettings = {
  language: languages[0].code,
  timezone: 0,
};

jest.mock('@cromwell/core-frontend', () => {
  return {
    getRestApiClient: () => {
      return {
        getCmsSettings: jest.fn().mockImplementation(() => testData),
        getAdminCmsSettings: jest.fn().mockImplementation(() => testData),
        saveCmsSettings: jest.fn().mockImplementation(() => true),
      };
    },
    getCStore: () => ({
      getActiveCurrencySymbol: () => '',
    }),
  };
});

import SettingsPage from './Settings';

describe('Settings page', () => {
  it('renders settings', async () => {
    render(<SettingsPage />);

    const element = await screen.findByText('General');
    element.click();

    await screen.findByText((text) => text.includes(languages[0].name));
  });
});
