import { render, screen } from '@testing-library/react';
import React from 'react';

import { CategorySort } from './CategorySort';

describe('CategorySort', () => {

  it("renders default", async () => {
    render(<CategorySort />);

    await screen.findByText('Highest rated');
  });

  it("overrides options", async () => {
    render(<CategorySort
      overrideOptions={[
        {
          label: '_test1_',
          key: 'id',
        }
      ]}
    />);

    await screen.findByText('_test1_');
  });
})
