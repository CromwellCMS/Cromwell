import React from 'react';
import { TPackageCromwellConfig, TPluginEntity } from '@cromwell/core';

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
const testDataDB: TPluginEntity[] = [
  {
    id: 1,
    name: '_test1_',
    title: '_test1_title',
    isInstalled: true,
  },
];

const activatePlugin = jest.fn().mockImplementation(async () => true);

jest.mock('@cromwell/core-frontend', () => {
  return {
    getGraphQLClient: () => {
      return {
        getAllEntities: jest.fn().mockImplementation(async () => testDataDB),
      };
    },
    getRestApiClient: () => {
      return {
        getPluginList: jest.fn().mockImplementation(async () => testDataAll),
        activatePlugin,
        getPluginUpdate: jest.fn().mockImplementation(async () => null),
        updatePlugin: jest.fn().mockImplementation(async () => null),
        deletePlugin: jest.fn().mockImplementation(async () => null),
      };
    },
  };
});

import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import PluginListPage from './PluginList';

describe('PluginList page', () => {
  it('renders plugins', async () => {
    render(
      <Router>
        <PluginListPage />
      </Router>,
    );

    await screen.findByText('_test1_title');
    await screen.findByText('_test2_title');
  });

  it('installs plugin', async () => {
    const { container } = render(
      <Router>
        <PluginListPage />
      </Router>,
    );

    await screen.findByText('_test1_title');
    await screen.findByText('_test2_title');

    Array.from(container.getElementsByTagName('button')).forEach((btn) => {
      fireEvent.click(btn);
    });
    await screen.findByText('_test2_title');

    expect(activatePlugin.mock.calls.length === 1).toBeTruthy();
  });
});
