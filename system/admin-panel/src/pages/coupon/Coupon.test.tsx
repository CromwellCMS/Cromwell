import React from 'react';
import { TCoupon } from '@cromwell/core';

const testData: TCoupon = {
  id: 1,
  code: '_test1_',
};

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    useParams: () => ({ id: '1' }),
    BrowserRouter: originalModule.BrowserRouter,
    useHistory: () => {},
    Link: () => <></>,
  };
});

jest.mock('../../constants/PageInfos', () => {
  return {
    couponPageInfo: {},
  };
});

jest.mock('@cromwell/core-frontend', () => {
  return {
    getGraphQLClient: () => {
      return {
        getCouponById: jest.fn().mockImplementation(() => testData),
      };
    },
    getCStore: () => {
      return {
        updateCart: jest.fn().mockImplementation(() => null),
        getCart: jest.fn().mockImplementation(() => []),
        addToCart: jest.fn().mockImplementation(() => []),
        clearCart: jest.fn().mockImplementation(() => []),
        removeFromCart: jest.fn().mockImplementation(() => []),
        getCartTotal: jest.fn().mockImplementation(() => ({})),
        getPriceWithCurrency: jest.fn().mockImplementation(() => ''),
        getActiveCurrencySymbol: jest.fn().mockImplementation(() => ''),
      };
    },
  };
});

import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import CouponPage from './Coupon';

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
