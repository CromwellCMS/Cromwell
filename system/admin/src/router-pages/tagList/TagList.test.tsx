import { render, screen } from '@testing-library/react';
import React from 'react';
import { TPagedList, TTag } from '@cromwell/core';

const testData: TPagedList<TTag> = {
  pagedMeta: { totalElements: 2, pageNumber: 1, pageSize: 2, totalPages: 1 },
  elements: [
    {
      id: 1,
      name: '_test1_',
    },
    {
      id: 2,
      name: '_test2_',
    },
  ],
};

jest.mock('@cromwell/core-frontend', () => {
  const loadable = jest.requireActual('@loadable/component')?.default;
  return {
    CList: (props: any) => {
      const Comp = loadable(async () => {
        const items: TPagedList<TTag> = await props.loader();
        const ListItem = props.ListItem;
        return () => (
          <div>
            {items.elements.map((it) => {
              return <ListItem key={it.id} data={it} listItemProps={props.listItemProps} />;
            })}
          </div>
        );
      });
      return <Comp />;
    },
    getGraphQLClient: () => {
      return {
        getTags: jest.fn().mockImplementation(async () => testData),
      };
    },
    getRestApiClient: () => {
      return {
        getCmsStatus: () => null,
      };
    },
    getCStore: () => {
      return {
        getPriceWithCurrency: jest.fn().mockImplementation((val) => val + ''),
      };
    },
  };
});

import { Provider } from 'react-redux-ts';
import TagListPage from './TagList';
import { BrowserRouter as Router } from 'react-router-dom';
import { store } from '../../redux/store';

describe('TagList page', () => {
  it('renders tags', async () => {
    render(
      <Provider store={store}>
        <Router>
          <TagListPage />
        </Router>
      </Provider>,
    );

    await screen.findByText('_test1_');
    await screen.findByText('_test2_');
  });
});
