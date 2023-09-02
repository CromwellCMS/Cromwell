import { render, screen } from '@testing-library/react';
import React from 'react';
import { TPagedList, TOrder } from '@cromwell/core';

const testData: TPagedList<TOrder> = {
  pagedMeta: { totalElements: 2, pageNumber: 1, pageSize: 2, totalPages: 1 },
  elements: [
    {
      id: 1,
      customerName: '_test1_',
    },
    {
      id: 2,
      customerName: '_test2_',
    },
  ],
};

const frontend = require('@cromwell/core-frontend');
frontend.getGraphQLClient = () => {
  return {
    getOrders: jest.fn().mockImplementation(async () => testData),
  };
};

import OrderListPage from './OrderList';
import { BrowserRouter as Router } from 'react-router-dom';

describe('OrderList page', () => {
  it('renders orders', async () => {
    render(
      <Router>
        <OrderListPage />
      </Router>,
    );

    await screen.findByText('_test1_');
    await screen.findByText('_test2_');
  });
});
