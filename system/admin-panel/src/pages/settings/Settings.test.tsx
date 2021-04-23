import { fireEvent, render, screen, act } from '@testing-library/react';
import { TCmsSettings } from '@cromwell/core';
import React from 'react';
import { launguages } from '../../constants/launguages';

const testData: TCmsSettings = {
    language: launguages[0].code,
    timezone: 0,
}

jest.mock('@cromwell/core-frontend', () => {
    return {
        getRestAPIClient: () => {
            return {
                getCmsSettings: jest.fn().mockImplementation(() => testData),
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

        await screen.findByText((text) => text.includes(launguages[0].name));
    });

})
