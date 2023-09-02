import { render, screen } from '@testing-library/react';
import { TUser } from '@cromwell/core';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

const testData: TUser = {
  fullName: '__test1__',
  email: '__test2__',
  id: 1,
};

const frontend = require('@cromwell/core-frontend');
frontend.getGraphQLClient = () => {
  return {
    createUser: jest.fn().mockImplementation(() => true),
  };
};
frontend.getRestApiClient = () => {
  return {
    setUpCms: jest.fn().mockImplementation(() => true),
    login: jest.fn().mockImplementation(() => true),
    getUserInfo: jest.fn().mockImplementation(() => testData),
    getCmsStatus: () => null,
  };
};

import WelcomePage from './Welcome';

describe('Welcome page', () => {
  it('logs in, fetches user data', async () => {
    render(
      <Router>
        <WelcomePage />
      </Router>,
    );

    await screen.findByText('Create');

    const emailInput = document.getElementById('email-input');
    expect(emailInput).toBeTruthy();
    const passwordInput = document.getElementById('password-input');
    expect(passwordInput).toBeTruthy();
    const nameInput = document.getElementById('name-input');
    expect(nameInput).toBeTruthy();

    // fireEvent.change(nameInput, { target: { value: 'Michael' } });
    // fireEvent.change(emailInput, { target: { value: 'Michael@example.com' } });
    // fireEvent.change(passwordInput, { target: { value: 'passs' } });
    // // fireEvent.click(loginBtn);

    // // await act(async () => {
    // //     const userInfo = getStoreItem('userInfo');
    // //     expect(userInfo.fullName).toEqual(testData.fullName);
    // // });
  });
});
