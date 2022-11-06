import { render, screen } from '@testing-library/react';
import React from 'react';

import { SignUp } from './SignUp';

describe('SignUp', () => {
  it('renders SignUp', async () => {
    render(<SignUp />);
    await screen.findByText('Sign up');
  });
});
