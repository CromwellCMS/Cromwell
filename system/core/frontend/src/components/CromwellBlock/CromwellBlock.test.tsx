import { render, screen } from '@testing-library/react';
import React from 'react';

import { CromwellBlock } from './CromwellBlock';

describe('CromwellBlock', () => {

    it("renders children", async () => {
        render(<CromwellBlock id="1" type="container"><p>_test1_</p></CromwellBlock>);

        await screen.findByText('_test1_');
    });


})
