import { render, screen } from '@testing-library/react';
import React from 'react';

const testData = {
    id: '_test1_',
    name: '_test1_',
}

jest.mock('@cromwell/core-frontend', () => {
    return {
        ...jest.requireActual('@cromwell/core-frontend'),
        CGallery: props => props.gallery?.slides ?? null,
        getRestApiClient: () => {
            return {
                getUserInfo: () => ({
                    id: 'test',
                    email: 'test@test.org',
                    role: 'administrator',
                }),
            }
        },
        getGraphQLClient: () => {
            return {
                getOrdersOfUser: () => ({
                    elements: [{
                        cart: [{
                            product: testData
                        }]
                    }]
                }),
            }
        },
    }
});

import AccountPage from '../../src/pages/account';

describe('/account', () => {

    it("renders orders of user", async () => {
        render(<AccountPage
            cmsProps={{}}
        />);

        await screen.findByText(testData.name);
    });
})
