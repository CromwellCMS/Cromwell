import { render } from '@testing-library/react';
import React from 'react';

jest.mock('@cromwell/core-frontend', () => {
    return {
        ...jest.requireActual('@cromwell/core-frontend'),
        CGallery: props => props.gallery?.slides ?? null,
    }
});

import HomePage from '../../src/pages';

describe('/', () => {

    it("renders", async () => {
        render(<HomePage />);
    });
})
