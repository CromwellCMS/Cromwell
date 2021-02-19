jest.mock('react-router-dom', () => {
    return {
        useParams: () => ({ id: '1' }),
        useHistory: () => { }
    }
});

import { TPost } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import PostPage from './Post';



describe('Post page', () => {

    const postData: TPost = {
        id: '1',
        title: 'test1',
        isPublished: false,
        delta: '{ \"ops\": [{ \"insert\": \"Lorem ipsum dolor sit amet\" }, {\"attributes\":{\"header\":1},\"insert\":\"\\n\"}] }'
    }

    const graphClient = getGraphQLClient();
    const getPostById = jest.spyOn(graphClient, 'getPostById');
    getPostById.mockImplementation(async () => postData);

    const updatePost = jest.spyOn(graphClient, 'updatePost');
    updatePost.mockImplementation(() => {
        return new Promise(done => true);
    });

    it("renders delta", async () => {
        render(<PostPage />);

        await screen.findByText('Lorem ipsum dolor sit amet');
    });

    it('saves post', async () => {
        const { container } = render(<PostPage />);

        await screen.findByText('Lorem ipsum dolor sit amet');
        const saveBtn = await screen.findByText('Save');
        fireEvent.click(saveBtn);
        expect(updatePost.mock.calls.length === 1).toBeTruthy();
    })

})
