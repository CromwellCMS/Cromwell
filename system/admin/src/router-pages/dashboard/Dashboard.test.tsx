import { TCmsStats } from '@cromwell/core';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import DashboardPage from './Dashboard';

const testData: TCmsStats = {
  reviews: 0,
  averageRating: 0,
  pages: 0,
  orders: 0,
  pageViews: 6666,
  topPageViews: [],
  salesValue: 999,
  salesPerDay: [],
  customers: 0,
};

const frontend = require('@cromwell/core-frontend');
frontend.getGraphQLClient = () => {
  return {
    getProductReviews: jest.fn().mockImplementation(() => undefined),
  };
};
frontend.getRestApiClient = () => {
  return {
    getCmsStatus: () => null,
    getCmsStats: jest.fn().mockImplementation(() => testData),
    getDashboardLayout: jest.fn().mockImplementation(() => {}),
  };
};

jest.mock('countup.js', () => {
  class CountUp {
    start = jest.fn().mockImplementation(() => undefined);
  }
  return {
    CountUp: CountUp,
  };
});

jest.mock('echarts', () => {
  return {
    init: () => {
      return {
        setOption: () => null,
      };
    },
  };
});

jest.mock('react-resize-detector', () => {
  return () => <></>;
});
// jest.mock('@mui/material', () => {
//   return {
//     Rating: () => <></>,
//     Skeleton: () => <></>,
//   };
// });

describe('Dashboard page', () => {
  it('renders stats', async () => {
    render(
      <Router>
        <DashboardPage />
      </Router>,
    );

    await screen.findByText(testData.pageViews + '');
    await screen.findByText(testData.salesValue + '');
  });
});
