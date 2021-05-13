import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import loadable from '@loadable/component';
import { TPagedList, TOrder } from '@cromwell/core';


const testData: TPagedList<TOrder> = {
    pagedMeta: { totalElements: 2, pageNumber: 1, pageSize: 2, totalPages: 1 },
    elements: [
        {
            id: '1',
            customerName: '_test1_',
        },
        {
            id: '2',
            customerName: '_test2_',
        }
    ]
};

jest.mock('../../constants/PageInfos', () => {
    return {
        orderListPageInfo: {},
        orderPageInfo: {},
    }
});


jest.mock('@cromwell/core-frontend', () => {
    return {
        CList: (props: any) => {
            const Comp = loadable(async () => {
                const items: TPagedList<TOrder> = await props.loader();
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
                getFilteredOrders: jest.fn().mockImplementation(() => testData)
            }
        },
        getRestAPIClient: () => {
            return {
                getCmsStatus: () => null,
            }
        },
        getCStore: () => ({
            getPriceWithCurrency: () => '',
        })
    }
});

import { Provider } from 'react-redux-ts';
import OrderListPage from './OrderList';
import { BrowserRouter as Router } from 'react-router-dom';
import { store } from '../../redux/store';

describe('OrderList page', () => {

    it("renders orders", async () => {
        render(
            <Provider store={store}>
                <Router>
                    <OrderListPage />
                </Router>
            </Provider>
        );

        await screen.findByText('_test1_');
        await screen.findByText('_test2_');
    });

})
