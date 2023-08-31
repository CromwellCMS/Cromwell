import { TCoupon, TPagedList } from '@cromwell/core';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux-ts';
import { BrowserRouter as Router } from 'react-router-dom';

import { store } from '../../redux/store';
import CouponList from './CouponList';

const testData: TPagedList<TCoupon> = {
  pagedMeta: { totalElements: 2, pageNumber: 1, pageSize: 2, totalPages: 1 },
  elements: [
    {
      id: 1,
      code: '_test1_',
    },
    {
      id: 2,
      code: '_test2_',
    },
  ],
};

const frontend = require('@cromwell/core-frontend');
frontend.getGraphQLClient = () => {
  return {
    getCoupons: jest.fn().mockImplementation(async () => testData),
  };
};

describe('CouponList page', () => {
  it('renders page', async () => {
    render(
      <Provider store={store}>
        <Router>
          <CouponList />
        </Router>
      </Provider>,
    );

    await screen.findByText('_test1_');
    await screen.findByText('_test2_');
  });
});
