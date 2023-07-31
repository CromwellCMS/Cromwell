import { render, screen } from '@testing-library/react';
import React from 'react';

jest.mock('@cromwell/core-frontend', () => {
  const originalModule = jest.requireActual('@cromwell/core-frontend');
  const apiClient = {
    getProductById: async () => ({
      id: 1,
      name: '_test2_',
    }),
    getAttributes: jest.fn().mockImplementation(async () => ({ elements: [] })),
  };
  return {
    ...originalModule,
    getGraphQLClient: () => {
      return apiClient;
    },
    getCStore: () => {
      return originalModule.getCStore({ apiClient });
    },
    useCart: () => {
      return originalModule.useCart({ cstoreOptions: { apiClient } });
    },
  };
});

import { CartList } from './CartList';
import { getCStore } from '@cromwell/core-frontend';

describe('CartList', () => {
  it('renders cart list', async () => {
    const cstore = getCStore();
    cstore.addToCart({
      product: {
        id: 1,
        name: '_test2_',
      },
    });

    render(<CartList getProductLink={(p) => p?.slug || ''} />);

    await screen.findByText('_test2_');
  });
});
