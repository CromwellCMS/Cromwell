import { render, screen } from '@testing-library/react';
import React from 'react';

jest.mock('@cromwell/core-frontend', () => {
    return {
        ...jest.requireActual('@cromwell/core-frontend'),
        CGallery: props => props.gallery?.slides ?? null,
    }
});

import Page from '../../src/pages/product/[slug]';

describe('/product/[slug]', () => {

    it("renders products", async () => {
        render(<Page
            product={{
                id: '_test_',
                name: '_test_',
            }}
        />);

        await screen.findByText('_test_');
    });
})
