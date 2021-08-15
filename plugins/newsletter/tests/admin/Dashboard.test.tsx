import { render, screen } from '@testing-library/react';
import React from 'react';


jest.mock('@cromwell/core-frontend', () => {
    return {
        getRestApiClient: () => {
            return {
                get: () => 5,
            }
        },
        getPluginStaticUrl: () => '',
    }
});
import { Dashboard } from '../../src/admin/widgets/Dashboard';

describe('admin dashboard widget', () => {

    it("renders page", async () => {
        render(<Dashboard
            stats={undefined}
            setSize={() => null}
        />);

        await screen.findByText('5 total newsletters');
    });
})
