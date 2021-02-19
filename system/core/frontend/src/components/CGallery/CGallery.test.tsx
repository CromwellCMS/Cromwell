import { render, screen } from '@testing-library/react';
import React from 'react';

import { CGallery } from './CGallery';

describe('CGallery', () => {

    it("renders images", async () => {
        render(<CGallery id="1" gallery={{
            loop: false,
            images: [
                {
                    src: '1',
                    alt: '_test1_'
                },
                {
                    src: '2',
                    alt: '_test2_'
                }

            ]
        }} />);

        await screen.findByAltText('_test1_');
        await screen.findByAltText('_test2_');
    });

    it("renders slides", async () => {
        render(<CGallery id="1" gallery={{
            loop: false,
            slides: [
                <p>_test3_</p>,
                <p>_test4_</p>
            ]
        }} />);

        await screen.findByText('_test3_');
        await screen.findByText('_test4_');
    });


})
