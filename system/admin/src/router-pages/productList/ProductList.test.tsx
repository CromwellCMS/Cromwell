import React from 'react';

const productsData: TPagedList<TProduct> = {
  pagedMeta: { totalElements: 2, pageNumber: 1, pageSize: 2, totalPages: 1 },
  elements: [
    {
      id: 1,
      name: '_test1_',
      categories: [],
    },
    {
      id: 2,
      name: '_test2_',
      categories: [],
    },
  ],
};

jest.mock('@cromwell/plugin-product-filter/src/frontend/components/Filter', () => {
  return () => <></>;
});

const frontend = require('@cromwell/core-frontend');
frontend.getGraphQLClient = () => {
  return {
    getProducts: jest.fn().mockImplementation(async () => productsData),
    getAttributes: jest.fn().mockImplementation(async () => ({ elements: [] })),
  };
};

import { TPagedList, TProduct } from '@cromwell/core';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import ProductListPage from './ProductList';

describe('ProductList page', () => {
  it('renders products', async () => {
    render(
      <Router>
        <ProductListPage />
      </Router>,
    );

    await screen.findByText('_test1_');
    await screen.findByText('_test2_');
  });
});
