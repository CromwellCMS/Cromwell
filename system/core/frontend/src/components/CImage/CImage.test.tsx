import { render, screen } from '@testing-library/react';
import React from 'react';

import { CImage } from './CImage';

describe('CImage', () => {
  it('renders children', async () => {
    render(<CImage id="1" image={{ alt: '_test1_' }} />);

    await screen.findByAltText('_test1_');
  });
});
