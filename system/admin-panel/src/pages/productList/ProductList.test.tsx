import React from 'react';
import loadable from '@loadable/component';

const productsData: TPagedList<TProduct> = {
    pagedMeta: { totalElements: 2, pageNumber: 1, pageSize: 2, totalPages: 1 },
    elements: [
        {
            id: '1',
            name: '_test1_',
            categories: [],
        },
        {
            id: '2',
            name: '_test2_',
            categories: [],
        }
    ]
};

jest.mock('@cromwell/core-frontend', () => {
    return {
        CList: (props: any) => {
            const Comp = loadable(async () => {
                const items: TPagedList<TProduct> = await props.loader();
                const ListItem = props.ListItem;
                return () => (
                    <div>
                        {items.elements.map(it => {
                            return <ListItem key={it.id} data={it} />
                        })}
                    </div>
                )
            });
            return <Comp />;
        },
        getGraphQLClient: () => {
            return {
                getFilteredProducts: jest.fn().mockImplementation(() => productsData)
            }
        },
        getCStore: () => {
            return {
                getPriceWithCurrency: price => price,
            }
        }
    }
});

import { TPagedList, TProduct } from '@cromwell/core';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import ProductListPage from './ProductList';

describe('ProductList page', () => {

    it("renders products", async () => {
        render(<Router><ProductListPage /></Router>);

        await screen.findByText('_test1_');
        await screen.findByText('_test2_');
    });
})
