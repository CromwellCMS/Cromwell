import { render, screen } from '@testing-library/react';
import React from 'react';
import { TPagedList, TUser } from '@cromwell/core';

const testData: TPagedList<TUser> = {
  pagedMeta: { totalElements: 2, pageNumber: 1, pageSize: 2, totalPages: 1 },
  elements: [
    {
      id: 1,
      fullName: '_test1_',
      email: '_emailtest1_',
    },
    {
      id: 2,
      fullName: '_test2_',
      email: '_emailtest2_',
    },
  ],
};

jest.mock('@cromwell/core-frontend', () => {
  const loadable = jest.requireActual('@loadable/component')?.default;
  return {
    CList: (props: any) => {
      const Comp = loadable(async () => {
        const items: TPagedList<TUser> = await props.loader();
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
        getUsers: jest.fn().mockImplementation(async () => testData),
        getRoles: jest.fn().mockImplementation(async () => []),
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
import UserListPage from './UserList';
import { BrowserRouter as Router } from 'react-router-dom';
import { store } from '../../redux/store';

describe('OrderList page', () => {
  it('renders orders', async () => {
    render(
      <Provider store={store}>
        <Router>
          <UserListPage />
        </Router>
      </Provider>,
    );

    await screen.findByText('_test1_');
    await screen.findByText('_test2_');
  });
});
