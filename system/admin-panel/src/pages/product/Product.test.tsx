import { TProduct } from '@cromwell/core';
import React from 'react';

const testData: TProduct = {
    id: 1,
    name: '_test1_',
    categories: []
};

jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        useParams: () => ({ id: '1' }),
        useHistory: () => { },
        BrowserRouter: originalModule.BrowserRouter,
        Link: () => <></>,
    }
});

jest.mock('../../constants/PageInfos', () => {
    return {
        productPageInfo: {},
        productListInfo: {},
    }
});

jest.mock('@cromwell/core-frontend', () => {
    return {
        getGraphQLClient: () => {
            return {
                getProductById: jest.fn().mockImplementation(async () => testData),
                getAttributes: jest.fn().mockImplementation(async () => ({ elements: [] })),
            }
        },
        CGallery: () => {
            return <div>...images mock</div>
        },
        getCStore: () => ({
            getActiveCurrencySymbol: () => '',
            getPriceWithCurrency: jest.fn().mockImplementation((val) => val + ''),
        }),
        getRestApiClient: () => {
            return {
                getCmsStatus: () => null,
            }
        },
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
