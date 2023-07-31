import { render, screen } from '@testing-library/react';
import React from 'react';

import { CContainer } from './CContainer';

describe('CContainer', () => {
  it('renders children', async () => {
    render(
      <CContainer id="1">
        <p>_test1_</p>
      </CContainer>,
    );

    await screen.findByText('_test1_');
  });
});
