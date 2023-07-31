jest.mock('next/link', () => {
  return {
    __esModule: true,
    default: undefined,
  };
});

import { render, screen } from '@testing-library/react';
import React from 'react';

import { Link } from './Link';

describe('Link', () => {
  it('renders Link', async () => {
    render(<Link href="#">_test2_</Link>);

    await screen.findByText('_test2_');
  });
});
