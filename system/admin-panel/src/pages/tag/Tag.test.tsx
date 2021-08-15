import React from 'react';
import { TTag } from '@cromwell/core';

const testData: TTag = {
    id: '1',
    name: '_test1_',
};

jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        useParams: () => ({ id: '1' }),
        BrowserRouter: originalModule.BrowserRouter,
        Link: () => <></>,
        useHistory: () => { },
    }
});

jest.mock('../../constants/PageInfos', () => {
    return {
        tagListPageInfo: {},
        tagPageInfo: {},
    }
});

jest.mock('@cromwell/core-frontend', () => {
    return {
        getGraphQLClient: () => {
            return {
                getTagById: jest.fn().mockImplementation(() => testData),
                updateTag: jest.fn().mockImplementation(() => testData),
            }
        },
        getRestApiClient: () => {
            return {
                getCmsStatus: () => null,
            }
        },
    }
});


import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import TagPage from './Tag';


describe('Tag page', () => {

    it("renders tag", async () => {
        render(<Router><TagPage /></Router>);

        await screen.findByDisplayValue('_test1_');
    });
})
