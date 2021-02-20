import { TPageConfig, TPageInfo } from '@cromwell/core';
import React from 'react';

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
const testPageConfig: TPageConfig = {
    route: '1',
    name: '_test1_name_',
    title: '_test1_title_',
    modifications: []
}

jest.mock('@cromwell/core-frontend', () => {
    return {
        getRestAPIClient: () => {
            return {
                getPagesInfo: jest.fn().mockImplementation(async () => pagesInfo),
                getPageConfig: jest.fn().mockImplementation(async () => testPageConfig),
                getThemeConfig: jest.fn().mockImplementation(async () => ({})),
                getThemeCustomConfig: jest.fn().mockImplementation(async () => ({})),
            }
        },
        loadFrontendBundle: jest.fn().mockImplementation(async () => () => <div></div>),
    }
});

import { getRestAPIClient } from '@cromwell/core-frontend';
import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import ThemeEditPage from './ThemeEdit';

describe('ThemeEdit page', () => {

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
