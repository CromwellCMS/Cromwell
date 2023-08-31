import React from 'react';
import { TPackageCromwellConfig, TPagedList, TCCSModuleInfo } from '@cromwell/core';

const testDataAll: TPackageCromwellConfig[] = [
  {
    name: '_test1_',
    title: '_test1_title',
  },
  {
    name: '_test2_',
    title: '_test2_title',
  },
];

jest.mock('@cromwell/core-frontend', () => {
  const loadable = jest.requireActual('@loadable/component')?.default;
  return {
    getRestApiClient: () => {
      return {
        getThemesInfo: jest.fn().mockImplementation(async () => testDataAll),
      };
    },
    getCentralServerClient: () => {
      return {
        getThemeList: jest.fn().mockImplementation(async () => ({ elements: testDataAll })),
      };
    },
    CList: (props: any) => {
      const Comp = loadable(async () => {
        const items: TPagedList<TCCSModuleInfo> = await props.loader();
        const ListItem = props.ListItem;
        return () => (
          <div>
            {items.elements.map((it) => {
              return <ListItem key={it.name} data={it} />;
            })}
          </div>
        );
      });
      return <Comp />;
    },
    CGallery: () => <></>,
  };
});

import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import PluginMarket from './ThemeMarket';

describe('PluginList page', () => {
  it('renders plugins', async () => {
    render(
      <Router>
        <PluginMarket />
      </Router>,
    );

    await screen.findByText('_test1_title');
    await screen.findByText('_test2_title');
  });
});
