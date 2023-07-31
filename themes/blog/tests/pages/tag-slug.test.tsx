import { render, screen } from '@testing-library/react';
import React from 'react';

import TagPage from '../../src/pages/tag/[slug]';

describe('/tag/[slug]', () => {
  it('renders posts', async () => {
    render(
      <TagPage
        posts={{
          pagedMeta: {
            pageNumber: 1,
            pageSize: 1,
            totalElements: 1,
          },
          elements: [
            {
              id: '_test_',
              title: '_test_',
            },
          ],
        }}
      />,
    );

    await screen.findByText('_test_');
  });
});
