import { TPagedList, TProductCategory } from '@cromwell/core';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux-ts';
import { BrowserRouter as Router } from 'react-router-dom';

import { store } from '../../redux/store';
import CategoryListPage from './CategoryList';

const testData: TPagedList<TProductCategory> = {
  elements: [
    {
      id: 1,
      name: '_test1_',
    },
    {
      id: 2,
      name: '_test2_',
    },
  ],
};

const frontend = require('@cromwell/core-frontend');
frontend.getGraphQLClient = () => {
  return {
    getRootCategories: jest.fn().mockImplementation(() => testData),
  };
};

describe('CategoryList page', () => {
  it('renders categories', async () => {
    render(
      <Provider store={store}>
        <Router>
        <CategoryListPage />
        </Router>
      </Provider>,
    );

    await screen.findByText('_test1_');
    await screen.findByText('_test2_');
  });
});
