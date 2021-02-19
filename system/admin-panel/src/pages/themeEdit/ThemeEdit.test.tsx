import { TPageInfo } from '@cromwell/core';
import { getRestAPIClient } from '@cromwell/core-frontend';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import ThemeEditPage from './ThemeEdit';

describe('ThemeEdit page', () => {

    const pagesInfo: TPageInfo[] = [
        {
            route: '1',
            name: '_test1_name_',
            title: '_test1_title_',
        },
        {
            route: '2',
            name: '_test2_name_',
            title: '_test2_title_',
        }
    ]

    const apiClient = getRestAPIClient();
    const getPagesInfo = jest.spyOn(apiClient, 'getPagesInfo');
    getPagesInfo.mockImplementation(async () => pagesInfo);

    const getPageConfig = jest.spyOn(apiClient, 'getPageConfig');
    getPageConfig.mockImplementation(async () => ({
        route: '1',
        name: '_test1_name_',
        title: '_test1_title_',
        modifications: []
    }));

    const getThemeConfig = jest.spyOn(apiClient, 'getThemeConfig');
    getThemeConfig.mockImplementation(async () => ({}));

    const getThemeCustomConfig = jest.spyOn(apiClient, 'getThemeCustomConfig');
    getThemeCustomConfig.mockImplementation(async () => ({}));

    it("renders sidebar with pages", async () => {
        render(<Router><ThemeEditPage /></Router>);

        await screen.findByText('_test1_name_');
        await screen.findByText('_test2_name_');
    });

    it("opens page settings", async () => {
        render(<Router><ThemeEditPage /></Router>);

        const pageBtn = await screen.findByText('_test1_name_');
        fireEvent.click(pageBtn);

        const settingsBtn = await screen.findByText('Page settings');
        await screen.findByDisplayValue('_test1_title_')
    });
})
