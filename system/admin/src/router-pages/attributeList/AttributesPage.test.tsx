import { TAttribute } from '@cromwell/core';
import { render, screen } from '@testing-library/react';
import React from 'react';

import AttributesPage from './AttributesList';

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

const frontend = require('@cromwell/core-frontend');
frontend.getGraphQLClient = () => {
  return {
    getAttributes: jest.fn().mockImplementation(async () => ({ elements: testData })),
  };
};

describe('AttributesPage', () => {
  it('renders attributes', async () => {
    render(<AttributesPage />);

    await screen.findByDisplayValue(testData[0].key!);
    await screen.findByDisplayValue(testData[1].key!);
  });
});
