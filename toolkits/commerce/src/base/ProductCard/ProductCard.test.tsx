import { render, screen } from '@testing-library/react';
import React from 'react';

jest.doMock('@cromwell/core-frontend', () => {
  const originalModule = jest.requireActual('@cromwell/core-frontend');
  return {
    ...originalModule,
    getGraphQLClient: () => {
      return {
        getAttributes: jest.fn().mockImplementation(async () => ({ elements: [] })),
      };
    },
    getCStore: () => {
      return originalModule.getCStore({ apiClient: {} });
    },
    useCart: () => {
      return originalModule.useCart({ cstoreOptions: { apiClient: {} } });
    },
    useWishlist: () => {
      return originalModule.useWishlist({ cstoreOptions: { apiClient: {} } });
    },
  };
});

import { AppPropsContext } from '@cromwell/core-frontend';
import { ProductCard } from './ProductCard';

describe('ProductCard', () => {
  it('renders', async () => {
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
        <ProductCard
          product={{
            id: 1,
            name: '_test1_',
          }}
          getProductLink={(p) => p?.slug || ''}
        />
      </AppPropsContext.Provider>,
    );
    await screen.findByText('_test1_');
  });
});
