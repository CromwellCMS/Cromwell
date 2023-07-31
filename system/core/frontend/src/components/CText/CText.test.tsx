import { render, screen } from '@testing-library/react';
import React from 'react';

import { CText } from './CText';

describe('CText', () => {
  it('renders text', async () => {
    render(<CText id="1">_test1_</CText>);

    await screen.findByText('_test1_');
  });
});
