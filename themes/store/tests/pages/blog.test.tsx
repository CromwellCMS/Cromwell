import { render, screen } from '@testing-library/react';
import React from 'react';

import BlogPage from '../../src/pages/blog';


describe('/blog', () => {

    it("renders posts", async () => {
        render(<BlogPage
            posts={{
                pagedMeta: {
                    pageNumber: 1,
                    pageSize: 1,
                    totalElements: 1,
                },
                elements: [{
                    id: '_test_',
                    title: '_test_',
                }]
            }}
        />);

        await screen.findByText('_test_');
    });
})
