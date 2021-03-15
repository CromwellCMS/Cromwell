import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import loadable from '@loadable/component';
import { TPagedList, TUser } from '@cromwell/core';


const testData: TPagedList<TUser> = {
    pagedMeta: { totalElements: 2, pageNumber: 1, pageSize: 2, totalPages: 1 },
    elements: [
        {
            id: '1',
            fullName: '_test1_',
            email: '_emailtest1_',
        },
        {
            id: '2',
            fullName: '_test2_',
            email: '_emailtest2_',
        }
    ]
};

jest.mock('../../constants/PageInfos', () => {
    return {
        productPageInfo: {},
    }
});


jest.mock('@cromwell/core-frontend', () => {
    return {
        CList: (props: any) => {
            const Comp = loadable(async () => {
                const items: TPagedList<TUser> = await props.loader();
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
                getFilteredUsers: jest.fn().mockImplementation(() => testData)
            }
        },
    }
});

import { Provider } from 'react-redux-ts';
import UserListPage from './UserList';
import { BrowserRouter as Router } from 'react-router-dom';
import { store } from '../../redux/store';

describe('OrderList page', () => {

    it("renders orders", async () => {
        render(
            <Provider store={store}>
                <Router>
                    <UserListPage />
                </Router>
            </Provider>
        );

        await screen.findByText('_test1_');
        await screen.findByText('_test2_');
    });

})
