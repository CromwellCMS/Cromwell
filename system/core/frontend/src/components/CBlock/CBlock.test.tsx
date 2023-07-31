import { render, screen } from '@testing-library/react';
import React from 'react';

import { CBlock } from './CBlock';

describe('CBlock', () => {
  it('renders children', async () => {
    render(
      <CBlock id="1">
        <p>_test1_</p>
      </CBlock>,
    );

    await screen.findByText('_test1_');
  });
});
