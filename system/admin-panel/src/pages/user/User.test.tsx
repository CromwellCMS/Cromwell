import React from 'react';
import { TUser } from '@cromwell/core';

const testData: TUser = {
    id: '1',
    email: '_test1_',
    fullName: '123'
};

jest.mock('../../constants/PageInfos', () => {
    return {
        userPageInfo: {},
    }
});

jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        useParams: () => ({ id: '1' }),
        useHistory: () => { },
        BrowserRouter: originalModule.BrowserRouter,
        Link: () => <></>,
    }
});

jest.mock('@cromwell/core-frontend', () => {
    return {
        getGraphQLClient: () => {
            return {
                getUserById: jest.fn().mockImplementation(() => testData),
                createUser: jest.fn().mockImplementation(() => testData),
                updateUser: jest.fn().mockImplementation(() => testData),
            }
        },
    }
});


import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import UserPage from './User';


describe('User page', () => {

    it("renders page", async () => {
        render(<Router><UserPage /></Router>);

        await screen.findByDisplayValue(testData.email);
    });
})
