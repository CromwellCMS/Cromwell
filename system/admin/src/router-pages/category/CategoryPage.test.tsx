import { TProductCategory } from '@cromwell/core';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import CategoryPage from './CategoryPage';

const testData: TProductCategory = {
  id: 1,
  name: '_test1_',
};

const frontend = require('@cromwell/core-frontend');
frontend.getGraphQLClient = () => {
  return {
    getProductCategoryById: jest.fn().mockImplementation(() => testData),
    createProductCategory: jest.fn().mockImplementation(() => testData),
    updateProductCategory: jest.fn().mockImplementation(() => testData),
    getProductCategories: jest.fn().mockImplementation(() => ({ elements: [testData] })),
  };
};

describe('Category page', () => {
  it('renders category', async () => {
    render(
      <Router>
        <CategoryPage />
      </Router>,
    );

    await screen.findByDisplayValue('_test1_');
  });
});
