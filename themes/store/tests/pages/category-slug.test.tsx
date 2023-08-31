import { render, screen } from '@testing-library/react';
import React from 'react';

jest.doMock('@cromwell/core-frontend', () => {
  return {
    ...jest.requireActual('@cromwell/core-frontend'),
    CGallery: (props) => props.gallery?.slides ?? null,
    getRestApiClient: () => {
      return {};
    },
    getGraphQLClient: () => {
      return {};
    },
  };
});

import CategoryPage from '../../src/pages/category/[slug]';

describe('/category/[slug]', () => {
  it('renders products', async () => {
    render(
      <CategoryPage
        cmsProps={{}}
        category={{
          id: '_test1_',
          name: '_test1_',
        }}
      />,
    );

    await screen.findByText('_test1_');
  });
});
