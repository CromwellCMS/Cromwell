import React from 'react';
import { TOrder } from '@cromwell/core';

const testData: TOrder = {
    id: '1',
    customerName: '_test1_',
};

jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        useParams: () => ({ id: '1' }),
        BrowserRouter: originalModule.BrowserRouter,
        Link: () => <></>
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
            }
        }
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
