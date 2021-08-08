import { render, screen } from '@testing-library/react';
import React from 'react';

jest.mock('@cromwell/admin-panel', () => {
    return {
        PluginSettingsLayout: (props) => props.children({ pluginSettings: props.pluginSettings }),
    }
});

import { SettingsPage } from '../../src/admin/widgets/SettingsPage';

describe('SettingsPage', () => {

    it("renders settings", async () => {
        render(<SettingsPage
            pluginName="showcase"
            pluginSettings={{
                size: 30
            }}
        />);

        await screen.findByDisplayValue('30');
    });
})
