jest.mock('../../helpers/loadFrontendBundle', () => {
    return {
        getLoadableFrontendBundle: () => (props) => {
            return (
                <p>{props.pluginName}</p>
            )
        }
    }
});

jest.mock('../../api/CRestAPIClient', () => {
    return { getRestAPIClient: () => ({}) };
});

import { render, screen } from '@testing-library/react';
import React from 'react';

import { CPlugin } from './CPlugin';


describe('CPlugin', () => {


    it("renders plugin component", async () => {
        render(<CPlugin id="1" pluginName={'_test1_'} />);

        await screen.findByText('_test1_');
    });
})
