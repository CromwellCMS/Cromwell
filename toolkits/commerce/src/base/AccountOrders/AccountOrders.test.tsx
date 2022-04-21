import { render, screen } from '@testing-library/react';
import React from 'react';
import { setStoreItem, TOrder } from '@cromwell/core';

jest.mock('@cromwell/core-frontend', () => {
  const originalModule = jest.requireActual('@cromwell/core-frontend');

  const apiClient = {
    getProductById: async () => ({
      id: 1,
      name: '_test2_'
    }),
    getAttributes: jest.fn().mockImplementation(async () => []),
    getOrdersOfUser: () => ({
      elements: [{
        id: 666
      }] as TOrder[]
    }),
  }

  return {
    ...originalModule,
    getCStore: () => originalModule.getCStore({ apiClient, local: true, }),
    useCart: () => {
      return originalModule.useCart({ cstoreOptions: { apiClient, local: true, } })
    },
    getGraphQLClient: () => {
      return apiClient;
    },
  }
});

import { AccountOrders } from './AccountOrders';

describe('AccountOrders', () => {

  it("renders", async () => {
    setStoreItem('userInfo', {
      id: 1,
      roles: [{ name: 'administrator', permissions: ['all'], id: 1 }],
    });

    render(<AccountOrders />);

    await screen.findByText('Order #666 from');
  });

})
