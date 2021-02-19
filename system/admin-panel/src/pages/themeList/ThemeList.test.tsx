import { TPackageCromwellConfig, TThemeEntity } from '@cromwell/core';
import { getGraphQLClient, getRestAPIClient } from '@cromwell/core-frontend';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import ThemeListPage from './ThemeList';

describe('ThemeList page', () => {

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
    const testDataDB: TThemeEntity[] = [
        {
            id: '_test1_',
            name: '_test1_',
            title: '_test1_title',
            isInstalled: true,
        },
    ]

    const apiClient = getRestAPIClient();
    const getThemesInfo = jest.spyOn(apiClient, 'getThemesInfo');
    getThemesInfo.mockImplementation(async () => testDataAll);

    const graphClient = getGraphQLClient();
    const getAllEntities = jest.spyOn(graphClient, 'getAllEntities');
    getAllEntities.mockImplementation(async () => testDataDB);

    const getCmsSettingsAndSave = jest.spyOn(apiClient, 'getCmsSettingsAndSave');
    getCmsSettingsAndSave.mockImplementation(async () => ({
        apiPort: 1,
        adminPanelPort: 1,
        frontendPort: 1,
        managerPort: 1,
        themeName: '_test1_'
    }));

    const installTheme = jest.spyOn(apiClient, 'installTheme');
    installTheme.mockImplementation(() => {
        return new Promise(done => true);
    });

    it("renders themes", async () => {
        const { container } = render(<ThemeListPage />);

        await screen.findByText('_test1_title');
        await screen.findByText('_test2_title');
    });

    it('installs theme', async () => {
        const { container } = render(<ThemeListPage />);

        await screen.findByText('_test1_title');
        await screen.findByText('_test2_title');

        const installBtn = screen.getByText('Install theme');
        fireEvent.click(installBtn);

        expect(installTheme.mock.calls.length === 1).toBeTruthy();
    })

})
