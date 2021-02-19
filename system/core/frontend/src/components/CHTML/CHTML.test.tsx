import { render, screen } from '@testing-library/react';
import React from 'react';

import { CHTML } from './CHTML';

describe('CHTML', () => {

    it("renders children", async () => {
        render(<CHTML id="1"><p>_test1_</p></CHTML>);

        await screen.findByText('_test1_');
    });


})
