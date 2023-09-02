import React from 'react';

const settings = {
  key: 'test',
};

const frontend = require('@cromwell/core-frontend');
frontend.getRestApiClient = () => {
  return {
    getCmsStatus: () => null,
    getPluginList: jest.fn().mockImplementation(async () => []),
    getPluginSettings: jest.fn().mockImplementation(() => settings),
  };
};
frontend.CPlugin = (props) => {
  return <p>{props.pluginName}</p>;
};

import { render, screen } from '@testing-library/react';

import PluginPage from './PluginPage';

describe('PluginPage', () => {
  const testPluginName = '_test_';

  jest.spyOn(URLSearchParams.prototype, 'get').mockImplementation((key) => {
    if (key === 'pluginName') return testPluginName;
    return null;
  });

  it('renders plugin', async () => {
    render(<PluginPage />);

    await screen.findByText(testPluginName);
  });
});
