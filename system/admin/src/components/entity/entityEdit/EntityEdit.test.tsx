import { EDBEntity, TBasePageEntity, TProductCategory } from '@cromwell/core';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import EntityEdit from './EntityEdit';

const testData: TProductCategory = {
  id: 1,
  slug: '_test1_',
};

jest.mock('@cromwell/core-frontend', () => {
  return {
    CList: () => {
      return <div>...list</div>;
    },
    getRestApiClient: () => {
      return {
        getCmsStatus: () => null,
      };
    },
  };
});

describe('EntityEdit page', () => {
  it('renders EntityEdit', async () => {
    render(
      <Router>
        <EntityEdit
          entityCategory={EDBEntity.CustomEntity}
          listLabel="Custom"
          getById={async (): Promise<TBasePageEntity> => testData}
          //@ts-ignore
          match={{ params: { id: 1 } }}
        />
      </Router>,
    );

    await screen.findByDisplayValue(testData.slug!);
  });
});
