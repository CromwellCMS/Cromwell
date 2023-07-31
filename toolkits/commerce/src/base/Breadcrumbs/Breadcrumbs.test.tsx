import { render, screen } from '@testing-library/react';
import React from 'react';

import { Breadcrumbs } from './Breadcrumbs';

describe('Breadcrumbs', () => {
  it('renders breadcrumbs from data', async () => {
    render(
      <Breadcrumbs
        data={{
          categories: [
            {
              id: 1,
              name: '_test1_',
            },
            {
              id: 2,
              name: '_test2_',
            },
          ],
        }}
        getBreadcrumbLink={(c) => c?.slug || ''}
      />,
    );

    await screen.findByText('_test1_');
    await screen.findByText('_test2_');
  });
});
