import { fireEvent, render, screen, act } from '@testing-library/react';
import { getStoreItem, TUser } from '@cromwell/core';
import React from 'react';

const testData: TUser = {
    fullName: '__test1__',
    email: '__test2__',
    roles: [{ name: 'administrator', permissions: ['all'], id: 1 }],
    id: 1
}
jest.mock('@cromwell/core-frontend', () => {
    return {
        getRestApiClient: () => {
            return {
                login: jest.fn().mockImplementation(() => true),
                getUserInfo: jest.fn().mockImplementation(() => testData),
            }
        },
        iconFromPath: () => null,
        getCmsStatus: async () => null,
    }
});

jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        useHistory: () => { },
        BrowserRouter: originalModule.BrowserRouter,
        Link: () => <></>,
        withRouter: (c) => c,
    }
});

import LoginPage from './LoginPage';

describe('Login page', () => {

    it("logs in, fetches user data", async () => {
        render(<LoginPage />);

        const loginBtn = await screen.findByText('Login');

        const emailInput = document.getElementById('email-input');
        expect(emailInput).toBeTruthy();
        const passwordInput = document.getElementById('password-input');
        expect(passwordInput).toBeTruthy();

        fireEvent.change(emailInput, { target: { value: 'Michael@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'passs' } });
        fireEvent.click(loginBtn);

        await act(async () => {
            const userInfo = getStoreItem('userInfo');
            expect(userInfo.fullName).toEqual(testData.fullName);
        });
    });
});
