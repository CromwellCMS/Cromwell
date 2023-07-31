import { setStoreItem } from '@cromwell/core';
import { render, screen } from '@testing-library/react';
import React from 'react';

import { AccountInfo } from './AccountInfo';

describe('AccountInfo', () => {
  it('renders fields', async () => {
    setStoreItem('userInfo', {
      id: 1,
      roles: [{ name: 'administrator', permissions: ['all'], id: 1 }],
    });
    render(
      <AccountInfo
        fields={[
          {
            key: '_test1_',
            label: '_test1_',
          },
          {
            key: '_test2_',
            label: '_test2_',
          },
        ]}
      />,
    );

    await screen.findByPlaceholderText('_test1_');
    await screen.findByPlaceholderText('_test2_');
  });
});
