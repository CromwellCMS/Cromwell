import React from 'react';
import { TPackageCromwellConfig } from '@cromwell/core';

const testDataAll: TPackageCromwellConfig[] = [
  {
    name: '_test1_',
    title: '_test1_title',
  },
  {
    name: '_test2_',
    title: '_test2_title',
  },
];

const frontend = require('@cromwell/core-frontend');
frontend.getRestApiClient = () => {
  return {
    getPluginList: jest.fn().mockImplementation(async () => testDataAll),
    getCmsStatus: () => null,
  };
};
frontend.getCentralServerClient = () => {
  return {
    getPluginList: jest.fn().mockImplementation(async () => ({ elements: testDataAll })),
  };
};

import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import PluginMarket from './PluginMarket';

describe('PluginList page', () => {
  it('renders plugins', async () => {
    render(
      <Router>
        <PluginMarket />
      </Router>,
    );

    await screen.findByText('_test1_title');
    await screen.findByText('_test2_title');
  });
});
