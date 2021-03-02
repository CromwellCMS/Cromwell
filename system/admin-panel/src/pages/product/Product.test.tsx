import { TProduct } from '@cromwell/core';
import React from 'react';

const testData: TProduct = {
    id: '1',
    name: '_test1_',
    categories: []
};

jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        useParams: () => ({ id: '1' }),
        useHistory: () => { },
        BrowserRouter: originalModule.BrowserRouter,
    }
});

jest.mock('../../constants/PageInfos', () => {
    return {
        productPageInfo: {},
    }
});

jest.mock('@cromwell/core-frontend', () => {
    return {
        getGraphQLClient: () => {
            return {
                getProductById: jest.fn().mockImplementation(async () => testData),
                getAttributes: jest.fn().mockImplementation(async () => []),
            }
        },
        CGallery: () => {
            return <div>...images mock</div>
        },
        getCStore: () => ({
            getActiveCurrencySymbol: () => ''
        }),
    }
});

import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import ProductPage from './Product';

describe('Product page', () => {

    it("renders product main", async () => {
        render(<Router><ProductPage /></Router>);

        await screen.findByDisplayValue('_test1_');
    });
})
