import { render, screen } from '@testing-library/react';
import React from 'react';

import BlogPage from '../../src/pages/blog/[slug]';


describe('/blog/[slug]', () => {

    it("renders posts", async () => {
        render(<BlogPage
            cmsProps={{}}
            post={{
                id: 1,
                title: '_test_',
            }}
        />);

        await screen.findByText('_test_');
    });
})
