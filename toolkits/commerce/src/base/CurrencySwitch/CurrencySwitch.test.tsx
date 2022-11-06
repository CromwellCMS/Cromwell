import { render, screen } from '@testing-library/react';
import React from 'react';
import { getStoreItem, setStoreItem } from '@cromwell/core';

jest.mock('@cromwell/core-frontend', () => {
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
    CContainer: (props) => props.children,
    CText: (props) => props.children,
  };
});

import { CurrencySwitch } from './CurrencySwitch';

describe('CurrencySwitch', () => {
  it('renders currencies', async () => {
    const settings = getStoreItem('cmsSettings');
    setStoreItem('cmsSettings', {
      ...(settings ?? {}),
      currencies: [
        ...(settings?.currencies ?? []),
        {
          title: '_test1_',
          tag: '_test1_',
          id: '1',
        },
      ],
    });

    render(<CurrencySwitch />);

    await screen.findByText('_test1_');
  });
});
