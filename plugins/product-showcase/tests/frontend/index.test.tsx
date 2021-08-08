import { render, screen } from '@testing-library/react';
import React from 'react';

jest.mock('@cromwell/core-frontend', () => {
    return {
        CGallery: props => props.gallery?.slides ?? null,
        Link: props => props.children,
    }
});

import Showcase from '../../src/frontend/index';

describe('plugin frontend', () => {

    it("renders showcase items", async () => {
        render(<Showcase
            pluginName="showcase"
            data={{
                productShowcase: {
                    elements: [
                        {
                            id: '_test1_',
                            name: '_test1_',
                        }
                    ]
                }
            }}
        />);

        await screen.findByText('_test1_');
    });
})
