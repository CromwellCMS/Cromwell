import { TPagedList } from '@cromwell/core';
import { render, screen } from '@testing-library/react';
import React from 'react';

import { CList } from './CList';

describe('CList', () => {
  const testData: TestData[] = [
    { id: '1', name: '_test1_' },
    { id: '2', name: '_test2_' },
    { id: '3', name: '_test3_' },
  ];
  const testPaged: TPagedList<TestData> = {
    pagedMeta: {},
    elements: testData,
  };

  it('renders items from dataList', async () => {
    render(
      <CList
        id="1"
        dataList={testData}
        ListItem={(props) => {
          return <p>{props.data?.name}</p>;
        }}
      />,
    );

    await screen.findByText('_test1_');
    screen.getByText('_test2_');
    screen.getByText('_test3_');
  });

  it('renders items from firstBatch', async () => {
    render(
      <CList<TestData>
        id="1"
        firstBatch={testPaged}
        loader={async () => ({ pagedMeta: {}, elements: [] })}
        ListItem={(props) => {
          return <p>{props.data?.name}</p>;
        }}
      />,
    );

    await screen.findByText('_test1_');
    screen.getByText('_test2_');
    screen.getByText('_test3_');
  });

  it('renders items from loader', async () => {
    render(
      <CList<TestData>
        id="1"
        loader={async () => testPaged}
        ListItem={(props) => {
          return <p>{props.data?.name}</p>;
        }}
      />,
    );

    await screen.findByText('_test1_');
    screen.getByText('_test2_');
    screen.getByText('_test3_');
  });
});

type TestData = {
  id: string;
  name: string;
};
