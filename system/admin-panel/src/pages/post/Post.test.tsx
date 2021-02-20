import React from 'react';
import { TPost } from '@cromwell/core';

jest.mock('react-router-dom', () => {
    return {
        useParams: () => ({ id: '1' }),
        useHistory: () => { }
    }
});

const testData: TPost = {
    id: '1',
    title: 'test1',
    isPublished: false,
    delta: '{ \"ops\": [{ \"insert\": \"Lorem ipsum dolor sit amet\" }, {\"attributes\":{\"header\":1},\"insert\":\"\\n\"}] }'
}
const updatePost = jest.fn().mockImplementation(async () => true);

jest.mock('@cromwell/core-frontend', () => {
    return {
        getGraphQLClient: () => {
            return {
                getPostById: jest.fn().mockImplementation(async () => testData),
                updatePost,
            }
        },
    }
});

import { getGraphQLClient } from '@cromwell/core-frontend';
import { fireEvent, render, screen } from '@testing-library/react';

import PostPage from './Post';



describe('Post page', () => {

    const graphClient = getGraphQLClient();

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
