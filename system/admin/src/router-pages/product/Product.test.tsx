import { TProduct } from '@cromwell/core';
import React from 'react';

const testData: TProduct = {
  id: 1,
  name: '_test1_',
  categories: [],
};

const frontend = require('@cromwell/core-frontend');
frontend.getGraphQLClient = () => {
  return {
    getProductById: jest.fn().mockImplementation(async () => testData),
    getAttributes: jest.fn().mockImplementation(async () => ({ elements: [] })),
  };
};

import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import ProductPage from './Product';

describe('Product page', () => {
  it('renders product main', async () => {
    render(
      <Router>
        <ProductPage />
      </Router>,
    );

    await screen.findByDisplayValue('_test1_');
  });
});
