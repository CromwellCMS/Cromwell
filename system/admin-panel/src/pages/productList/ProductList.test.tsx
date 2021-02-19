import { TPagedList, TProduct } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import * as coreFrontend from '@cromwell/core-frontend';
import loadable from '@loadable/component';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import ProductListPage from './ProductList';

describe('ProductList page', () => {

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

    const graphClient = getGraphQLClient();
    const getProducts = jest.spyOn(graphClient, 'getProducts');
    getProducts.mockImplementation(async () => productsData);

    const CList = jest.spyOn<any, any>(coreFrontend, 'CList');
    CList.mockImplementation((props: any) => {
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
    });

    it("renders products", async () => {
        render(<Router><ProductListPage /></Router>);

        await screen.findByText('_test1_');
        await screen.findByText('_test2_');
    });
})
