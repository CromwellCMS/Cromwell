import { render, screen } from '@testing-library/react';
import React from 'react';
import { getCStore } from '@cromwell/core-frontend';

jest.mock('@cromwell/core-frontend', () => {
  const originalModule = jest.requireActual('@cromwell/core-frontend');
  return {
    ...originalModule,
    getGraphQLClient: () => {
      return {
        getAttributes: jest.fn().mockImplementation(async () => [])
      }
    },
    getCStore: () => {
      return originalModule.getCStore({ apiClient: {} });
    },
    useCart: () => {
      return originalModule.useCart({ cstoreOptions: { apiClient: {} } })
    },
    getGraphQLErrorInfo: (err) => err,
    CContainer: (props) => props.children,
    CText: (props) => props.children,
  }
});

import { ProductActions } from './ProductActions';

describe('ProductActions', () => {

  it("allows to add", async () => {
    render(<ProductActions
      product={{
        id: 1
      }}
    />);

    await screen.findByText('Add to cart');
    await screen.findByText('Add to wishlist');
  });


  it("out of stock", async () => {
    render(<ProductActions
      product={{
        id: 1,
        stockStatus: 'Out of stock'
      }}
    />);

    await screen.findByText('Out of stock');
  });


  it("in cart", async () => {
    const product = {
      id: 2,
    }
    getCStore().addToCart({
      product,
      amount: 1,
    });

    render(<ProductActions
      product={product}
    />);

    await screen.findByText('Open cart');
  });
})
