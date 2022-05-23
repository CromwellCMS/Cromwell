import React from 'react';
import { TAttribute } from '@cromwell/core';

const testData: TAttribute[] = [
    {
        id: 1,
        key: 'test attribute 1',
        values: [],
        type: 'radio',
    },
    {
        id: 2,
        key: 'test2',
        values: [],
        type: 'radio',
    },
];

jest.mock('@cromwell/core-frontend', () => {
    return {
        getGraphQLClient: () => {
            return {
                getAttributes: jest.fn().mockImplementation(async () => ({ elements: testData }))
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
import AttributesPage from './AttributesList';


describe('AttributesPage', () => {


    it("renders attributes", async () => {
        render(<AttributesPage />);

        await screen.findByDisplayValue(testData[0].key);
        await screen.findByDisplayValue(testData[1].key);
    });
})
