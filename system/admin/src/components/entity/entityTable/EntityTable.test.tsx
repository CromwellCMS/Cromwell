import { EDBEntity, TBaseFilter, TBasePageEntity, TCustomEntityColumn, TPagedList } from '@cromwell/core';
import { render, screen, act } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { TEntityPageProps } from '../types';
import EntityTable from './EntityTable';

type TItem = TBasePageEntity & {
  name: string;
};
const testData: TPagedList<TItem> = {
  elements: [
    {
      id: 1,
      name: 'test1',
    },
    {
      id: 2,
      name: 'test2',
    },
  ],
};
const EntityTableComp = EntityTable as React.ComponentType<TEntityPageProps<TItem, TBaseFilter>>;

const columns: TCustomEntityColumn[] = [
  {
    name: 'id',
    label: 'ID',
    type: 'Simple text',
    visible: true,
  },
  {
    name: 'name',
    label: 'name',
    type: 'Simple text',
    visible: true,
  },
];

describe('EntityTable component', () => {
  it('renders table', async () => {
    act(() => {
      render(
        <Router>
          <EntityTableComp
            entityCategory={EDBEntity.CustomEntity}
            listLabel="Entities"
            getMany={async () => testData}
            columns={columns}
          />
        </Router>,
      );
    });

    // Column names
    await screen.findByText(columns[0].label);
    await screen.findByText(columns[1].label);

    // Data
    await screen.findByText(testData.elements![0].name!);
    await screen.findByText(testData.elements![1].name!);
  });
});
