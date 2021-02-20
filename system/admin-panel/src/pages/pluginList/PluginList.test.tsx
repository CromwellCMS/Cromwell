import React from 'react';
import { TPackageCromwellConfig, TPluginEntity } from '@cromwell/core';

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

const installPlugin = jest.fn().mockImplementation(async () => true);

jest.mock('@cromwell/core-frontend', () => {
    return {
        getGraphQLClient: () => {
            return {
                getAllEntities: jest.fn().mockImplementation(async () => testDataDB),
            }
        },
        getRestAPIClient: () => {
            return {
                getPluginList: jest.fn().mockImplementation(async () => testDataAll),
                installPlugin,
            }
        }
    }
});

import { fireEvent, render, screen, act } from '@testing-library/react';

import PluginListPage from './PluginList';

describe('PluginList page', () => {


    it("renders plugins", async () => {
        render(<PluginListPage />);

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
        await screen.findByText('_test2_title');

        expect(installPlugin.mock.calls.length === 1).toBeTruthy();
    })

})
