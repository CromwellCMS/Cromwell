import { TPagedList, TPost } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import * as coreFrontend from '@cromwell/core-frontend';
import loadable from '@loadable/component';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import PostListPage from './PostList';

describe('PostList page', () => {

    const postsData: TPagedList<TPost> = {
        pagedMeta: { totalElements: 2, pageNumber: 1, pageSize: 2, totalPages: 1 },
        elements: [
            {
                id: '1',
                title: '_test1_',
                isPublished: false,
            },
            {
                id: '2',
                title: '_test2_',
                isPublished: true,
            }
        ]
    };

    const graphClient = getGraphQLClient();
    const getPosts = jest.spyOn(graphClient, 'getPosts');
    getPosts.mockImplementation(async () => postsData);

    const CList = jest.spyOn<any, any>(coreFrontend, 'CList');
    CList.mockImplementation((props: any) => {
        const Comp = loadable(async () => {
            const items: TPagedList<TPost> = await props.loader();
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

    it("renders posts", async () => {
        render(<Router><PostListPage /></Router>);

        await screen.findByText('_test1_');
        await screen.findByText('_test2_');
    });
})
