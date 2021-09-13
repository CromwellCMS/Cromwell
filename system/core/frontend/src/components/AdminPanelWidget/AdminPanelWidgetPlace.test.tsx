import { render, screen } from '@testing-library/react';
import React from 'react';

import { AdminPanelWidgetPlace } from './AdminPanelWidgetPlace';
import { registerWidget } from '../../helpers/registerWidget';

describe('AdminPanelWidget', () => {

    it("registers and renders all plugin widgets at place", async () => {
        registerWidget({
            widgetName: 'PluginSettings',
            pluginName: "_test1_",
            component: () => (<p>_test1_</p>)
        });

        render(<AdminPanelWidgetPlace
            widgetName="PluginSettings"
        />);

        await screen.findByText('_test1_');
    });

    it("registers and renders specific plugin widget at place", async () => {
        registerWidget({
            widgetName: 'PluginSettings',
            pluginName: "_test1_",
            component: () => (<p>_test1_</p>)
        });

        render(<AdminPanelWidgetPlace
            widgetName="PluginSettings"
            pluginName="_test1_"
        />);

        await screen.findByText('_test1_');
    });
})
