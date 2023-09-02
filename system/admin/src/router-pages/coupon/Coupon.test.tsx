import { TCoupon } from '@cromwell/core';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import CouponPage from './Coupon';

const testData: TCoupon = {
  id: 1,
  code: '_test1_',
};

const frontend = require('@cromwell/core-frontend');
frontend.getGraphQLClient = () => {
  return {
    getCouponById: jest.fn().mockImplementation(() => testData),
  };
};

describe('Coupon page', () => {
  it('renders order', async () => {
    render(
      <Router>
        <CouponPage />
      </Router>,
    );

    await screen.findByDisplayValue('_test1_');
  });
});
