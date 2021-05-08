import { render, screen } from '@testing-library/react';
import React from 'react';

jest.mock('react-resize-detector', () => {
    return (props) => <>{props.children({ width: 400, height: 400 })}</>;
});

import { CGallery } from './CGallery';

const images = [
    {
        src: '_test1_',
        alt: '_test1_'
    },
    {
        src: '_test2_',
        alt: '_test2_'
    }

]

describe('CGallery', () => {

    it("renders images", async () => {
        const result = render(<CGallery id="1" gallery={{
            loop: false,
            images,
        }} />);

        expect(result.container.querySelector(`[src=${images[0].src}]`)).toBeTruthy();
        expect(result.container.querySelector(`[src=${images[1].src}]`)).toBeTruthy();
    });

    it("renders slides", async () => {
        render(<CGallery id="1" gallery={{
            loop: false,
            slides: [
                <p key="1">_test3_</p>,
                <p key="2">_test4_</p>
            ]
        }} />);

        await screen.findByText('_test3_');
        await screen.findByText('_test4_');
    });


})
