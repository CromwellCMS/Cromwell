import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

const testData = {
  data: {
    getProducts: {
      elements: [
        {
          id: 1,
          name: '_test1_',
        },
        {
          id: 2,
          name: '_test2_',
        },
      ],
    },
  },
};

jest.mock('@cromwell/core-frontend', () => {
  const originalModule = jest.requireActual('@cromwell/core-frontend');
  return {
    ...originalModule,
    getGraphQLClient: () => {
      return {
        query: jest.fn().mockImplementation(async () => testData),
        PagedMetaFragment: '',
      };
    },
    getCStore: () => {
      return originalModule.getCStore({ local: true, apiClient: {} });
    },
    LoadBox: () => null,
  };
});

import { ProductSearch } from './ProductSearch';

describe('ProductSearch', () => {
  it('opens and fetches list on input', async () => {
    const inputPlaceholder = 'inputPlaceholder';
    render(<ProductSearch text={{ searchLabel: inputPlaceholder }} />);

    const input = await screen.findByPlaceholderText(inputPlaceholder);
    fireEvent.change(input, { target: { value: 'a' } });

    await screen.findByText('_test1_');
    await screen.findByText('_test2_');
  });
});
