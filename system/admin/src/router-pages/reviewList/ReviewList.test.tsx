import { render, screen } from '@testing-library/react';
import React from 'react';
import { TPagedList, TProductReview } from '@cromwell/core';

const testData: TPagedList<TProductReview> = {
  pagedMeta: { totalElements: 2, pageNumber: 1, pageSize: 2, totalPages: 1 },
  elements: [
    {
      id: 1,
      productId: 1,
      userName: '_test1_',
    },
    {
      id: 2,
      productId: 2,
      userName: '_test2_',
    },
  ],
};

const frontend = require('@cromwell/core-frontend');
frontend.getGraphQLClient = () => {
  return {
    getProductReviews: jest.fn().mockImplementation(async () => testData),
  };
};

import ProductReviewPage from './ReviewList';
import { BrowserRouter as Router } from 'react-router-dom';

describe('ProductReview page', () => {
  it('renders reviews', async () => {
    render(
      <Router>
        <ProductReviewPage />
      </Router>,
    );

    await screen.findByText('_test1_');
    await screen.findByText('_test2_');
  });
});
