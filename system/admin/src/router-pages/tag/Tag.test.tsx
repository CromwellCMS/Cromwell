import React from 'react';
import { TTag } from '@cromwell/core';

const testData: TTag = {
  id: 1,
  name: '_test1_',
};

const frontend = require('@cromwell/core-frontend');
frontend.getGraphQLClient = () => {
  return {
    getTagById: jest.fn().mockImplementation(() => testData),
    updateTag: jest.fn().mockImplementation(() => testData),
  };
};

import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import TagPage from './Tag';

describe('Tag page', () => {
  it('renders tag', async () => {
    render(
      <Router>
        <TagPage />
      </Router>,
    );

    await screen.findByDisplayValue('_test1_');
  });
});
