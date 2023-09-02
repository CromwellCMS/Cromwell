import { render, screen } from '@testing-library/react';
import React from 'react';
import { TPagedList, TTag } from '@cromwell/core';

const testData: TPagedList<TTag> = {
  pagedMeta: { totalElements: 2, pageNumber: 1, pageSize: 2, totalPages: 1 },
  elements: [
    {
      id: 1,
      name: '_test1_',
    },
    {
      id: 2,
      name: '_test2_',
    },
  ],
};

const frontend = require('@cromwell/core-frontend');
frontend.getGraphQLClient = () => {
  return {
    getTags: jest.fn().mockImplementation(async () => testData),
  };
};

import TagListPage from './TagList';
import { BrowserRouter as Router } from 'react-router-dom';

describe('TagList page', () => {
  it('renders tags', async () => {
    render(
      <Router>
        <TagListPage />
      </Router>,
    );

    await screen.findByText('_test1_');
    await screen.findByText('_test2_');
  });
});
