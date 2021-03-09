import React from 'react';
import loadable from '@loadable/component';
import { TProductCategory, TPagedList } from '@cromwell/core';

const testData: TPagedList<TProductCategory> = {
    elements: [
        {
            id: '1',
            name: '_test1_',
        },
        {
            id: '2',
            name: '_test2_',
        }
    ]
};

jest.mock('@cromwell/core-frontend', () => {
    return {
        getGraphQLClient: () => {
            return {
                getRootCategories: jest.fn().mockImplementation(() => testData),
            }
        },
    }
});

jest.mock('../../constants/PageInfos', () => {
    return {
        categoryPageInfo: {},
    }
});


import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux-ts';

import CategoryListPage from './CategoryList';
import { store } from '../../redux/store';


describe('CategoryList page', () => {

    it("renders categories", async () => {
        render(
            <Provider store={store}>
                <Router>
                    <CategoryListPage />
                </Router>
            </Provider>
        );

        await screen.findByText('_test1_');
        await screen.findByText('_test2_');
    });
})
