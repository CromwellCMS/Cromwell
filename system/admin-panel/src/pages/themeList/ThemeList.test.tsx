import { TCmsSettings, TPackageCromwellConfig, TThemeEntity } from '@cromwell/core';
import React from 'react';

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
const cmsSettings: TCmsSettings = {
    apiPort: 1,
    adminPanelPort: 1,
    frontendPort: 1,
    managerPort: 1,
    themeName: '_test1_'
}

const activateTheme = jest.fn().mockImplementation(async () => true);

jest.mock('../../constants/PageInfos', () => {
    return {
        themeEditPageInfo: {},
    }
});

jest.mock('@cromwell/core-frontend', () => {
    return {
        getGraphQLClient: () => {
            return {
                getAllEntities: jest.fn().mockImplementation(async () => testDataDB),
            }
        },
        getRestAPIClient: () => {
            return {
                getThemesInfo: jest.fn().mockImplementation(async () => testDataAll),
                getCmsSettingsAndSave: jest.fn().mockImplementation(async () => cmsSettings),
                getThemeUpdate: jest.fn().mockImplementation(async () => null),
                activateTheme,
                getCmsStatus: () => null,
            }
        },
        getWebSocketClient: () => undefined,
    }
});

import { fireEvent, render, screen } from '@testing-library/react';

import ThemeListPage from './ThemeList';

describe('ThemeList page', () => {

    it("renders themes", async () => {
        render(<ThemeListPage />);

        await screen.findByText('_test1_title');
        await screen.findByText('_test2_title');
    });

    it('installs theme', async () => {
        render(<ThemeListPage />);

        await screen.findByText('_test1_title');
        await screen.findByText('_test2_title');

        const installBtn = screen.getByText('Install theme');
        fireEvent.click(installBtn);

        await screen.findByText('_test2_title');

        expect(activateTheme.mock.calls.length === 1).toBeTruthy();
    })

})
