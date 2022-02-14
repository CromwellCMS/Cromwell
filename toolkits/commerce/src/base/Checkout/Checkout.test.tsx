import { render, screen } from '@testing-library/react';
import React from 'react';

jest.mock('@cromwell/core-frontend', () => {
  const originalModule = jest.requireActual('@cromwell/core-frontend');
  return {
    ...originalModule,
    getGraphQLClient: () => {
      return {
        getAttributes: jest.fn().mockImplementation(async () => [])
      }
    },
    getRestApiClient: () => {
      return {
        createPaymentSession: () => null,
        placeOrder: () => null,
      }
    },
    getCStore: () => {
      return originalModule.getCStore({ apiClient: {} });
    },
    useCart: () => {
      return originalModule.useCart({ cstoreOptions: { apiClient: {} } })
    },
  }
});

import { Checkout } from './Checkout';
import { getCStore } from '@cromwell/core-frontend';

describe('Checkout', () => {

  it("renders", async () => {
    const cstore = getCStore();
    cstore.addToCart({
      product: {
        id: 1,
        name: '_test11_'
      }
    });

    render(<Checkout
      text={{
        shippingAddress: '_test7_'
      }}
    />);

    await screen.findByText('_test7_');
  });


  it("renders custom fields", async () => {
    const cstore = getCStore();
    cstore.addToCart({
      product: {
        id: 1,
        name: '_test2_'
      }
    });
    render(<Checkout
      fields={[{
        key: 'test',
        label: '_test2_'
      }]}
    />);

    await screen.findByPlaceholderText('_test2_')
  });

  it("renders custom payment options", async () => {
    const cstore = getCStore();
    cstore.addToCart({
      product: {
        id: 1,
        name: '_test2_'
      }
    });
    render(<Checkout
      getPaymentOptions={() => {
        return [{
          link: '1',
          key: '1',
          name: '_test9_',
        }]
      }}
    />);

    await screen.findByText('_test9_');
  });
})
