import React from 'react';
import PluginPage from './PluginPage';
import { getRestAPIClient } from '@cromwell/core-frontend';
import * as coreFrontend from '@cromwell/core-frontend';
import { render, screen, waitFor, act, findAllByDisplayValue } from '@testing-library/react';

describe('AttributesPage', () => {

    const coreFrontendSpy = jest.spyOn(coreFrontend, 'CPlugin');
    coreFrontendSpy.mockImplementation((props) => {
        return <p>{props.pluginName}</p>
    });

    const testPluginName = '_test_';
    const settings = {
        key: 'test'
    };

    jest.spyOn(URLSearchParams.prototype, 'get')
        .mockImplementation((key) => {
            if (key === 'pluginName') return testPluginName;
            return null;
        });

    const apiClient = getRestAPIClient();
    const getPluginSettingsSpy = jest.spyOn(apiClient, 'getPluginSettings');
    getPluginSettingsSpy.mockImplementation(async () => settings)

    it("renders plugin", async () => {
        render(<PluginPage />);

        await screen.findByText(testPluginName);
    });

})
