import { render, screen } from '@testing-library/react';
import React from 'react';


jest.mock('@cromwell/core-frontend', () => {
    return {
        ...jest.requireActual('@cromwell/core-frontend'),
        CGallery: props => props.gallery?.slides ?? null,
        getRestApiClient: () => {
            return {}
        },
        getGraphQLClient: () => {
            return {}
        },
    }
});

import CategoryPage from '../../src/pages/category/[slug]';

describe('/category/[slug]', () => {

    it("renders products", async () => {
        render(<CategoryPage
            category={{
                id: '_test1_',
                name: '_test1_',
            }}
            products={{
                pagedMeta: {
                    pageNumber: 1,
                    pageSize: 1,
                    totalElements: 1,
                },
                elements: [{
                    id: '_test2_',
                    name: '_test2_',
                }]
            }}
        />);

        await screen.findByText('_test1_');
        await screen.findByText('_test2_');
    });
})
