import React from 'react';
import { TPackageCromwellConfig, TPagedList, TCCSModuleInfoDto } from '@cromwell/core';
import loadable from '@loadable/component';

const testDataAll: TPackageCromwellConfig[] = [
    {
        name: '_test1_',
        title: '_test1_title'
    },
    {
        name: '_test2_',
        title: '_test2_title'
    }
];

jest.mock('@cromwell/core-frontend', () => {
    return {
        getRestAPIClient: () => {
            return {
                getPluginList: jest.fn().mockImplementation(async () => testDataAll),
            }
        },
        getCentralServerClient: () => {
            return {
                getPluginList: jest.fn().mockImplementation(async () => ({ elements: testDataAll })),
            }
        },
        CList: (props: any) => {
            const Comp = loadable(async () => {
                const items: TPagedList<TCCSModuleInfoDto> = await props.loader();
                const ListItem = props.ListItem;
                return () => (
                    <div>
                        {items.elements.map(it => {
                            return <ListItem key={it.name} data={it} />
                        })}
                    </div>
                )
            });
            return <Comp />;
        },
    }
});

import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import PluginMarket from './PluginMarket';

describe('PluginList page', () => {


    it("renders plugins", async () => {
        render(<Router><PluginMarket /></Router>);

        await screen.findByText('_test1_title');
        await screen.findByText('_test2_title');
    });

})
