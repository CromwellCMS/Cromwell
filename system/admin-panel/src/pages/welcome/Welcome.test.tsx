import { fireEvent, render, screen, act } from '@testing-library/react';
import { getStoreItem, TUser } from '@cromwell/core';
import React from 'react';

const testData: TUser = {
    fullName: '__test1__',
    email: '__test2__',
    id: 1
}
jest.mock('@cromwell/core-frontend', () => {
    return {
        getRestApiClient: () => {
            return {
                setUpCms: jest.fn().mockImplementation(() => true),
                login: jest.fn().mockImplementation(() => true),
                getUserInfo: jest.fn().mockImplementation(() => testData),
            }
        },
        getGraphQLClient: () => {
            return {
                createUser: jest.fn().mockImplementation(() => true),
            }
        },
    }
});

jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        useHistory: () => { },
        BrowserRouter: originalModule.BrowserRouter,
        Link: () => <></>,
    }
});

import WelcomePage from './Welcome';

describe('Welcome page', () => {

    it("logs in, fetches user data", async () => {
        render(<WelcomePage />);

        const loginBtn = await screen.findByText('Create');

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

})
