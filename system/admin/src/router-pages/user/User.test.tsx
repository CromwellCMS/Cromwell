import React from 'react';
import { TUser } from '@cromwell/core';

const testData: TUser = {
  id: 1,
  email: '_test1_',
  fullName: '123',
};

const frontend = require('@cromwell/core-frontend');
frontend.getGraphQLClient = () => {
  return {
    getUserById: jest.fn().mockImplementation(() => testData),
    createUser: jest.fn().mockImplementation(() => testData),
    updateUser: jest.fn().mockImplementation(() => testData),
    getRoles: jest.fn().mockImplementation(() => []),
  };
};

import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import UserPage from './User';

describe('User page', () => {
  it('renders page', async () => {
    render(
      <Router>
        <UserPage />
      </Router>,
    );

    await screen.findByDisplayValue(testData.email!);
  });
});
