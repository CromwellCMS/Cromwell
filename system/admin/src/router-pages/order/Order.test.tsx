import React from 'react';
import { TOrder } from '@cromwell/core';

const testData: TOrder = {
  id: 1,
  customerName: '_test1_',
};

const frontend = require('@cromwell/core-frontend');
frontend.getGraphQLClient = () => {
  return {
    getOrderById: jest.fn().mockImplementation(() => testData),
    updateOrder: jest.fn().mockImplementation(() => testData),
    CouponFragment: '',
    OrderFragment: '',
  };
};

import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import OrderPage from './Order';

describe('Order page', () => {
  it('renders order', async () => {
    render(
      <Router>
        <OrderPage />
      </Router>,
    );

    await screen.findByDisplayValue(testData.customerName!);
  });
});
