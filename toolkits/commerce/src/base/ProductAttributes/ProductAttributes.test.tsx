import { render, screen } from '@testing-library/react';
import React from 'react';

jest.mock('@cromwell/core-frontend', () => {
  const originalModule = jest.requireActual('@cromwell/core-frontend');
  return {
    ...originalModule,
    getCStore: () => {
      return originalModule.getCStore({ local: true, apiClient: {} });
    },
  };
});

import { ProductAttributes } from './ProductAttributes';

describe('ProductAttributes', () => {
  it('renders attributes', async () => {
    render(
      <ProductAttributes
        product={{
          name: '_test1_',
          id: 1,
          categories: [],
          attributes: [
            {
              key: 'test_attr',
              values: [
                {
                  value: '_test_val_1_',
                },
              ],
            },
          ],
        }}
        attributes={[
          {
            id: 1,
            type: 'radio',
            key: 'test_attr',
            values: [
              {
                value: '_test_val_1_',
              },
            ],
          },
        ]}
      />,
    );

    await screen.findByText('_test_val_1_');
  });
});
