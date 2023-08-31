import { render, screen } from '@testing-library/react';
import React from 'react';

jest.doMock('@cromwell/core-frontend', () => {
  return {
    ...jest.requireActual('@cromwell/core-frontend'),
    CGallery: (props) => props.gallery?.slides ?? null,
  };
});

import Page from '../../src/pages/product/[slug]';

describe('/product/[slug]', () => {
  it('renders products', async () => {
    render(
      <Page
        cmsProps={{}}
        product={{
          id: 1,
          name: '_test_',
        }}
      />,
    );

    await screen.findByText('_test_');
  });
});
