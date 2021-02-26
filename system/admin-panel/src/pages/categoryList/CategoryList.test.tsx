import React from 'react';
import loadable from '@loadable/component';
import { TProductCategory } from '@cromwell/core';

const testData: TProductCategory[] = [
    {
        id: '1',
        name: '_test1_',
    },
    {
        id: '2',
        name: '_test2_',
    }
];

jest.mock('@cromwell/core-frontend', () => {
    return {
        getGraphQLClient: () => {
            return {
                getRootCategories: jest.fn().mockImplementation(() => testData),
            }
        },
    }
});


import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import CategoryListPage from './CategoryList';


describe('CategoryList page', () => {

    it("renders categories", async () => {
        render(<Router><CategoryListPage /></Router>);

        await screen.findByText('_test1_');
        await screen.findByText('_test2_');
    });
})
