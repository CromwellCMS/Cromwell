import { render, screen } from '@testing-library/react';
import React from 'react';

import { CEditor } from './CEditor';

describe('CEditor', () => {
  it('renders HTML', async () => {
    render(<CEditor id="1" editor={{ html: '<p>_test1_</p>' }} />);
    await screen.findByText('_test1_');
  });
});
