import { render } from '@testing-library/react';
import React from 'react';

jest.doMock('@cromwell/core-frontend', () => {
  return {
    ...jest.requireActual('@cromwell/core-frontend'),
    CGallery: (props) => props.gallery?.slides ?? null,
  };
});

import Page from '../../src/pages/pages/[slug]';

describe('/pages/[slug]', () => {
  it('renders', async () => {
    render(<Page />);
  });
});
