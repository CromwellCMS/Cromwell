import { render, screen } from '@testing-library/react';
import React from 'react';

jest.doMock('@cromwell/core-frontend', () => {
  const originalModule = jest.requireActual('@cromwell/core-frontend');
  const apiClient = {
    getProductById: async () => ({
      id: 1,
      name: '_test4_',
    }),
  };
  return {
    ...originalModule,
    getGraphQLClient: () => {
      return {
        getAttributes: jest.fn().mockImplementation(async () => ({ elements: [] })),
      };
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
    useViewedItems: () => {
      return originalModule.useViewedItems({ cstoreOptions: { apiClient } });
    },
  };
});

import { ViewedItems } from './ViewedItems';
import { getCStore } from '@cromwell/core-frontend';
import { AppPropsContext } from '@cromwell/core-frontend';

describe('ViewedItems', () => {
  it('renders list', async () => {
    const cstore = getCStore();
    cstore.addToViewedItems({
      product: {
        id: 1,
        name: '_test4_',
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
        <ViewedItems />
      </AppPropsContext.Provider>,
    );

    await screen.findByText('_test4_');
  });
});
