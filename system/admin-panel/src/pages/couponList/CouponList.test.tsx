import { render, screen } from '@testing-library/react';
import React from 'react';
import loadable from '@loadable/component';
import { TPagedList, TCoupon } from '@cromwell/core';

const testData: TPagedList<TCoupon> = {
  pagedMeta: { totalElements: 2, pageNumber: 1, pageSize: 2, totalPages: 1 },
  elements: [
    {
      id: 1,
      code: '_test1_',
    },
    {
      id: 2,
      code: '_test2_',
    },
  ],
};

jest.mock('../../constants/PageInfos', () => {
  return {
    couponListPageInfo: {},
    orderListPageInfo: {},
    couponPageInfo: {},
  };
});

jest.mock('@cromwell/core-frontend', () => {
  return {
    CList: (props: any) => {
      const Comp = loadable(async () => {
        const items: TPagedList<TCoupon> = await props.loader();
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
        getCoupons: jest.fn().mockImplementation(async () => testData),
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
import CouponList from './CouponList';
import { BrowserRouter as Router } from 'react-router-dom';
import { store } from '../../redux/store';

describe('CouponList page', () => {
  it('renders page', async () => {
    render(
      <Provider store={store}>
        <Router>
          <CouponList />
        </Router>
      </Provider>,
    );

    await screen.findByText('_test1_');
    await screen.findByText('_test2_');
  });
});
