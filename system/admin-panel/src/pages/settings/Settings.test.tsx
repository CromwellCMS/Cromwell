import { render, screen } from '@testing-library/react';
import { TCmsSettings } from '@cromwell/core';
import React from 'react';
import { languages } from '../../constants/languages';

const testData: TCmsSettings = {
    language: languages[0].code,
    timezone: 0,
}

jest.mock('@cromwell/core-frontend', () => {
    return {
        getRestAPIClient: () => {
            return {
                getCmsSettings: jest.fn().mockImplementation(() => testData),
                getAdvancedCmsSettings: jest.fn().mockImplementation(() => testData),
                updateCmsConfig: jest.fn().mockImplementation(() => true),
            }
        },
        getCStore: () => ({
            getActiveCurrencySymbol: () => '',
        })
    }
});

import SettingsPage from './Settings';

describe('Settings page', () => {

    it("renders settings", async () => {
        render(<SettingsPage />);

        await screen.findByText((text) => text.includes(languages[0].name));
    });

})
