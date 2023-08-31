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
import { CategoryList } from './CategoryList';

describe('CategoryList', () => {
  it('renders list', async () => {
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
        <CategoryList
          data={{
            firstPage: {
              elements: [
                {
                  id: 1,
                  name: '_test1_',
                },
              ],
            },
            category: {
              id: 2,
              name: '_test2_',
            },
          }}
        />
      </AppPropsContext.Provider>,
    );

    await screen.findByText('_test1_');
  });
});
