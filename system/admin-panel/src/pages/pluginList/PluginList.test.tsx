import { TPackageCromwellConfig, TPluginEntity } from '@cromwell/core';
import { getGraphQLClient, getRestAPIClient } from '@cromwell/core-frontend';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import PluginListPage from './PluginList';

describe('PluginList page', () => {

    const testDataAll: TPackageCromwellConfig[] = [
        {
            name: '_test1_',
            title: '_test1_title'
        },
        {
            name: '_test2_',
            title: '_test2_title'
        }
    ];
    const testDataDB: TPluginEntity[] = [
        {
            id: '_test1_',
            name: '_test1_',
            title: '_test1_title',
            isInstalled: true,
        },
    ]

    const apiClient = getRestAPIClient();
    const getPluginList = jest.spyOn(apiClient, 'getPluginList');
    getPluginList.mockImplementation(async () => testDataAll);

    const graphClient = getGraphQLClient();
    const getAllEntities = jest.spyOn(graphClient, 'getAllEntities');
    getAllEntities.mockImplementation(async () => testDataDB);

    const installPlugin = jest.spyOn(apiClient, 'installPlugin');
    installPlugin.mockImplementation(() => {
        return new Promise(done => true);
    });

    it("renders plugins", async () => {
        const { container } = render(<PluginListPage />);

        await screen.findByText('_test1_title');
        await screen.findByText('_test2_title');
    });

    it('installs plugin', async () => {
        const { container } = render(<PluginListPage />);

        await screen.findByText('_test1_title');
        await screen.findByText('_test2_title');

        Array.from(container.getElementsByTagName('button')).forEach(btn => {
            fireEvent.click(btn);
        });

        expect(installPlugin.mock.calls.length === 1).toBeTruthy();
    })

})
