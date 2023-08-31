import React from 'react';
import { TProductCategory } from '@cromwell/core';

const testData: TProductCategory = {
  id: 1,
  name: '_test1_',
};

jest.mock('@cromwell/core-frontend', () => {
  return {
    getGraphQLClient: () => {
      return {
        getProductCategoryById: jest.fn().mockImplementation(() => testData),
        createProductCategory: jest.fn().mockImplementation(() => testData),
        updateProductCategory: jest.fn().mockImplementation(() => testData),
        getProductCategories: jest.fn().mockImplementation(() => ({ elements: [testData] })),
      };
    },
    CList: () => {
      return <div>...list</div>;
    },
    getRestApiClient: () => {
      return {
        getCmsStatus: () => null,
      };
    },
  };
});

import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import CategoryPage from './CategoryPage';

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
