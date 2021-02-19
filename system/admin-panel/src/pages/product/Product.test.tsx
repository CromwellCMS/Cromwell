import { TProduct } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import ProductPage from './Product';

describe('Product page', () => {

    const productData: TProduct = {
        id: '1',
        name: '_test1_',
        categories: []
    };

    const graphClient = getGraphQLClient();
    const getProductById = jest.spyOn(graphClient, 'getProductById');
    getProductById.mockImplementation(async () => productData);

    it("renders product main", async () => {
        render(<Router><ProductPage /></Router>);

        await screen.findByDisplayValue('_test1_');
    });
})
