import React from 'react';

const productsData: TPagedList<TProduct> = {
  pagedMeta: { totalElements: 2, pageNumber: 1, pageSize: 2, totalPages: 1 },
  elements: [
    {
      id: 1,
      name: '_test1_',
      categories: [],
    },
    {
      id: 2,
      name: '_test2_',
      categories: [],
    },
  ],
};

jest.mock('@cromwell/plugin-product-filter/src/frontend/components/Filter', () => {
  return () => <></>;
});

jest.mock('@cromwell/core-frontend', () => {
  const loadable = jest.requireActual('@loadable/component')?.default;
  return {
    CList: (props: any) => {
      const Comp = loadable(async () => {
        const items: TPagedList<TProduct> = await props.loader();
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
    CPlugin: () => <></>,
    getGraphQLClient: () => {
      return {
        getProducts: jest.fn().mockImplementation(async () => productsData),
        getAttributes: jest.fn().mockImplementation(async () => ({ elements: [] })),
      };
    },
    getRestApiClient: () => {
      return {
        getCmsStatus: jest.fn().mockImplementation(async () => ({})),
      };
    },
    getCStore: () => {
      return {
        getPriceWithCurrency: (price) => price,
      };
    },
  };
});

import { TPagedList, TProduct } from '@cromwell/core';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux-ts';

import { store } from '../../redux/store';
import ProductListPage from './ProductList';

describe('ProductList page', () => {
  it('renders products', async () => {
    render(
      <Provider store={store}>
        <Router>
          <ProductListPage />
        </Router>
      </Provider>,
    );

    await screen.findByText('_test1_');
    await screen.findByText('_test2_');
  });
});
