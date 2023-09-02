import { render, screen } from '@testing-library/react';
import React from 'react';
import { TPagedList, TUser } from '@cromwell/core';

const testData: TPagedList<TUser> = {
  pagedMeta: { totalElements: 2, pageNumber: 1, pageSize: 2, totalPages: 1 },
  elements: [
    {
      id: 1,
      fullName: '_test1_',
      email: '_emailtest1_',
    },
    {
      id: 2,
      fullName: '_test2_',
      email: '_emailtest2_',
    },
  ],
};

const frontend = require('@cromwell/core-frontend');
frontend.getGraphQLClient = () => {
  return {
    getUsers: jest.fn().mockImplementation(async () => testData),
    getRoles: jest.fn().mockImplementation(async () => []),
  };
};

import UserListPage from './UserList';
import { BrowserRouter as Router } from 'react-router-dom';

describe('OrderList page', () => {
  it('renders orders', async () => {
    render(
      <Router>
        <UserListPage />
      </Router>,
    );

    await screen.findByText('_test1_');
    await screen.findByText('_test2_');
  });
});
