import { render, screen } from '@testing-library/react';
import React from 'react';

jest.doMock('@cromwell/core-frontend', () => {
  const originalModule = jest.requireActual('@cromwell/core-frontend');
  const apiClient = {
    getProductById: async () => ({
      id: 1,
      name: '_test3_',
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
    useWishlist: () => {
      return originalModule.useWishlist({ cstoreOptions: { apiClient } });
    },
  };
});

import { Wishlist } from './Wishlist';
import { getCStore } from '@cromwell/core-frontend';
import { AppPropsContext } from '@cromwell/core-frontend';

describe('Wishlist', () => {
  it('renders list', async () => {
    const cstore = getCStore();
    cstore.addToWishlist({
      product: {
        id: 1,
        name: '_test3_',
      },
    });

    render(
      <AppPropsContext.Provider
        value={{
          pageProps: {
            cmsProps: {
              defaultPages: {
                product: 'product/[slug]',
              },
            },
          },
        }}
      >
        <Wishlist />
      </AppPropsContext.Provider>,
    );

    await screen.findByText('_test3_');
  });
});
