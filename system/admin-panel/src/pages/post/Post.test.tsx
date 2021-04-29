import React from 'react';
import { TPost } from '@cromwell/core';

jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        useParams: () => ({ id: '1' }),
        useHistory: () => { },
        BrowserRouter: originalModule.BrowserRouter,
        Link: () => <></>,
        block: () => null,
    }
});

jest.mock('../../constants/PageInfos', () => {
    return {
        postListInfo: {},
        postPageInfo: {},
    }
});

const testData: TPost = {
    id: '1',
    title: 'test1',
    isPublished: true,
    slug: 'test_slug',
    delta: '{ \"ops\": [{ \"insert\": \"Lorem ipsum dolor sit amet\" }, {\"attributes\":{\"header\":1},\"insert\":\"\\n\"}] }'
}
const updatePost = jest.fn().mockImplementation(async () => true);

jest.mock('@cromwell/core-frontend', () => {
    return {
        getGraphQLClient: () => {
            return {
                getPostById: jest.fn().mockImplementation(async () => testData),
                updatePost,
                getTags: jest.fn().mockImplementation(() => []),
            }
        },
    }
});

import { getGraphQLClient } from '@cromwell/core-frontend';
import { fireEvent, render, screen, act } from '@testing-library/react';

import PostPage from './Post';



describe('Post page', () => {

    const graphClient = getGraphQLClient();

    it("renders delta", async () => {
        render(<PostPage />);

        await screen.findByText('Lorem ipsum dolor sit amet');
    });

    it('saves post', async () => {
        render(<PostPage />);

        await screen.findByText('Lorem ipsum dolor sit amet');

        fireEvent.click(document.getElementById('settings-button'));
        await screen.findByDisplayValue(testData.slug);
        fireEvent.click(document.getElementById('post-settings-close-btn'));
        const saveBtn = await screen.findByText('Save');

        await act(async () => {
            fireEvent.click(saveBtn);
            expect(updatePost.mock.calls.length).toEqual(1);
        })
    })

})
