import React from 'react';
import { TPost, sleep } from '@cromwell/core';

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
    published: true,
    slug: 'test_slug',
    delta: '{"time":1629830430985,"blocks":[{"id":"ik9CPF8uzr","type":"header","data":{"text":"Lorem ipsum dolor sit amet","level":2}},{"id":"SpXFHh321s","type":"paragraph","data":{"text":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sed viverra tellus in hac habitasse platea dictumst vestibulum rhoncus. Ac tortor dignissim convallis aenean et tortor. In iaculis nunc sed augue. Tristique senectus et netus et malesuada fames ac turpis. Fermentum leo vel orci porta non pulvinar neque. In fermentum posuere urna nec tincidunt praesent semper. Massa eget egestas purus viverra.&nbsp;"}}],"version":"2.22.2"}',  // eslint-disable-line
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
        getRestApiClient: () => {
            return {
                getCmsStatus: () => null,
            }
        },
    }
});

import { fireEvent, render, screen, act } from '@testing-library/react';

import PostPage from './Post';



describe('Post page', () => {

    it("renders delta", async () => {
        render(<PostPage />);
        await sleep(1);

        await screen.findByText('Lorem ipsum dolor sit amet');
    });

    it('opens settings', async () => {
        render(<PostPage />);
        await sleep(1);

        await screen.findByText('Lorem ipsum dolor sit amet');

        fireEvent.click(document.getElementById('more-button'));
        await screen.findByDisplayValue(testData.slug);
        fireEvent.click(document.getElementById('post-settings-close-btn'));
        await screen.findByText('Save');

        await act(async () => { });
    })

})
