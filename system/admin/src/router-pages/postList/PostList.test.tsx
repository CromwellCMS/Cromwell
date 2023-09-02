import React from 'react';
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
    },
  ],
};
const users: TPagedList<TUser> = {
  elements: [
    {
      id: 1,
      fullName: 'name1',
      email: 'mail1',
    },
  ],
};

const frontend = require('@cromwell/core-frontend');
frontend.getGraphQLClient = () => {
  return {
    getPosts: jest.fn().mockImplementation(async () => postsData),
    getUsers: jest.fn().mockImplementation(async () => users),
    getTags: jest.fn().mockImplementation(async () => []),
  };
};

import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import PostListPage from './PostList';

describe('PostList page', () => {
  it('renders posts', async () => {
    render(
      <Router>
        <PostListPage />
      </Router>,
    );

    await screen.findByText('_test1_');
    await screen.findByText('_test2_');
  });
});
