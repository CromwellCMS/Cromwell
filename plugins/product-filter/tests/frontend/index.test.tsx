import { render, screen } from '@testing-library/react';
import React from 'react';

jest.mock('@cromwell/admin-panel', () => {
    return {
        PluginSettingsLayout: (props) => props.children({ pluginSettings: props.pluginSettings }),
    }
});

jest.mock('@material-ui/core', () => {
    return {
        ...jest.requireActual('@material-ui/core'),
        useMediaQuery: () => null,
    }
});

jest.mock('@cromwell/core-frontend', () => {
    return {
        getGraphQLClient: () => ({}),
        iconFromPath: () => () => null,
        getCStore: () => ({
            getPriceWithCurrency: () => '',
        }),
    }
});

import Filter from '../../src/frontend/index';
import { TProductFilterData } from '../../src/frontend/service';


describe('plugin frontend', () => {

    it("renders filter with categories", async () => {
        render(<Filter
            pluginName="filter"
            data={{
                productCategory: {
                    id: '_test1_',
                    name: '_test1_',
                    parent: {
                        id: '_test2_',
                        name: '_test2_',
                    }
                }
            } as TProductFilterData}
        />);

        await screen.findByText('_test1_');
    });
})
