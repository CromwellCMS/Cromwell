jest.mock('next/link', () => {
    return {
        __esModule: true,
        default: undefined,
    }
});


import { render, screen } from '@testing-library/react';
import React from 'react';

import { Link, CLink } from './Link';

describe('CText', () => {

    it("renders CLink", async () => {
        render(<CLink id="1" href="#">_test1_</CLink>);

        await screen.findByText('_test1_');
    });

    it("renders Link", async () => {
        render(<Link href="#">_test2_</Link>);

        await screen.findByText('_test2_');
    });


})
