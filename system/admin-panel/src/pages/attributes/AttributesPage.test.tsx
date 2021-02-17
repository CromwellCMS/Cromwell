import { TAttribute } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { render, screen } from '@testing-library/react';
import React from 'react';

import AttributesPage from './AttributesPage';

describe('AttributesPage', () => {
    const testData: TAttribute[] = [
        {
            id: '1',
            key: 'test attribute 1',
            values: [],
            type: 'radio',
        },
        {
            id: '2',
            key: 'test2',
            values: [],
            type: 'radio',
        },
    ];

    const graphClient = getGraphQLClient();
    const getAttributesSpy = jest.spyOn(graphClient, 'getAttributes');
    getAttributesSpy.mockImplementation(async () => testData)

    it("renders attributes", async () => {
        render(<AttributesPage />);

        await screen.findByDisplayValue(testData[0].key);
        await screen.findByDisplayValue(testData[1].key);
    });
})
