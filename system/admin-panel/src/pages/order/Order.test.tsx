import React from 'react';
import { TOrder } from '@cromwell/core';

const testData: TOrder = {
    id: 1,
    customerName: '_test1_',
};

jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        useParams: () => ({ id: '1' }),
        BrowserRouter: originalModule.BrowserRouter,
        Link: () => <></>,
    }
});

jest.mock('../../constants/PageInfos', () => {
    return {
        orderListPageInfo: {},
        orderPageInfo: {},
    }
});

jest.mock('@cromwell/core-frontend', () => {
    return {
        getGraphQLClient: () => {
            return {
                getOrderById: jest.fn().mockImplementation(() => testData),
                updateOrder: jest.fn().mockImplementation(() => testData),
                CouponFragment: '',
                OrderFragment: '',
            }
        },
        getCStore: () => {
            return {
                updateCart: jest.fn().mockImplementation(() => null),
                getCart: jest.fn().mockImplementation(() => []),
                addToCart: jest.fn().mockImplementation(() => []),
                clearCart: jest.fn().mockImplementation(() => []),
                removeFromCart: jest.fn().mockImplementation(() => []),
                getCoupons: jest.fn().mockImplementation(() => []),
                getCartTotal: jest.fn().mockImplementation(() => ({})),
                getPriceWithCurrency: jest.fn().mockImplementation(() => ''),
                getActiveCurrencySymbol: jest.fn().mockImplementation(() => ''),
                setCoupons: jest.fn().mockImplementation(() => ''),
            }
        },
    }
});


import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import OrderPage from './Order';


describe('Order page', () => {

    it("renders order", async () => {
        render(<Router><OrderPage /></Router>);

        await screen.findByDisplayValue('_test1_');
    });
})
