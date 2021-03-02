import React from 'react';
import { TProductCategory } from '@cromwell/core';

const testData: TProductCategory = {
    id: '1',
    name: '_test1_',
};

jest.mock('../../constants/PageInfos', () => {
    return {
        categoryPageInfo: {},
    }
});

jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        useParams: () => ({ id: '1' }),
        useHistory: () => { },
        BrowserRouter: originalModule.BrowserRouter,
    }
});

jest.mock('@cromwell/core-frontend', () => {
    return {
        getGraphQLClient: () => {
            return {
                getProductCategoryById: jest.fn().mockImplementation(() => testData),
                createProductCategory: jest.fn().mockImplementation(() => testData),
                updateProductCategory: jest.fn().mockImplementation(() => testData),
                getFilteredProductCategories: jest.fn().mockImplementation(() => ({ elements: [testData] })),
            }
        },
        CList: (props) => {
            return <div>...list</div>
        }
    }
});


import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import CategoryPage from './CategoryPage';


describe('Category page', () => {

    it("renders category", async () => {
        render(<Router><CategoryPage /></Router>);

        await screen.findByDisplayValue('_test1_');
    });
})
