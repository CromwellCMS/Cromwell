import { render, screen } from '@testing-library/react';
import React from 'react';

import PluginFrontend from '../../src/frontend/index';

describe('plugin frontend', () => {

    it("renders plugin", async () => {
        render(<PluginFrontend />);

        await screen.findByText('Subscribe!');
    });
})
