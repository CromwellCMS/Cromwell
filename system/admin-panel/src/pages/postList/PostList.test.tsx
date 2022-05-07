import React from 'react';
import loadable from '@loadable/component';
import { TPagedList, TPost, TUser } from '@cromwell/core';

const postsData: TPagedList<TPost> = {
    pagedMeta: { totalElements: 2, pageNumber: 1, pageSize: 2, totalPages: 1 },
    elements: [
        {
            id: 1,
            title: '_test1_',
            published: false,
        },
        {
            id: 2,
            title: '_test2_',
            published: true,
        }
    ]
};
const users: TPagedList<TUser> = {
    elements: [
        {
            id: 1,
            fullName: 'name1',
            email: 'mail1',
        }
    ]
}

jest.mock('@cromwell/core-frontend', () => {
    return {
        CList: (props: any) => {
            const Comp = loadable(async () => {
                const items: TPagedList<TPost> = await props.loader();
                const ListItem = props.ListItem;
                return () => (
                    <div>
                        {items.elements.map(it => {
                            return <ListItem key={it.id} data={it} listItemProps={props.listItemProps} />
                        })}
                    </div>
                )
            });
            return <Comp />;
        },
        getGraphQLClient: () => {
            return {
                getPosts: jest.fn().mockImplementation(async () => postsData),
                getUsers: jest.fn().mockImplementation(async () => users),
                getTags: jest.fn().mockImplementation(async () => []),
            }
        },
        getRestApiClient: () => {
            return {
                getCmsStatus: () => null,
            }
        },
        getCStore: () => {
            return {
                getPriceWithCurrency: jest.fn().mockImplementation((val) => val + ''),
            }
        },
    }
});

jest.mock('../../constants/PageInfos', () => {
    return {
        postPageInfo: {},
        postListInfo: {},
    }
});

import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux-ts';
import { BrowserRouter as Router } from 'react-router-dom';

import { store } from '../../redux/store';
import PostListPage from './PostList';


describe('PostList page', () => {

    it("renders posts", async () => {
        render(
            <Provider store={store}>
                <Router>
                    <PostListPage />
                </Router>
            </Provider>
        );

        await screen.findByText('_test1_');
        await screen.findByText('_test2_');
    });
})
