import { EDBEntity, TBaseFilter, TBasePageEntity, TCustomEntityColumn, TPagedList } from '@cromwell/core';
import loadable from '@loadable/component';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux-ts';
import { BrowserRouter as Router } from 'react-router-dom';

import { store } from '../../../redux/store';


jest.mock('@cromwell/core-frontend', () => {
    return {
        CList: (props: any) => {
            const Comp = loadable(async () => {
                const items: TPagedList<any> = await props.loader();
                const ListItem = props.ListItem;
                return () => (
                    <div>
                        {items.elements.map(it => {
                            return <ListItem key={it.id} data={it} listItemProps={props.listItemProps} />
                        })}
                    </div>
                )
            });
            return <Comp />;
        },
        getCStore: () => ({
            getPriceWithCurrency: p => p,
        })
    }
});

import { TEntityPageProps } from '../types';
import EntityTable from './EntityTable';

type TItem = TBasePageEntity & {
    name: string;
}
const testData: TPagedList<TItem> = {
    elements: [
        {
            id: 1,
            name: 'test1',
        },
        {
            id: 2,
            name: 'test2',
        }
    ],
};
const EntityTableComp = EntityTable as React.ComponentType<TEntityPageProps<TItem, TBaseFilter>>;

const columns: TCustomEntityColumn[] = [
    {
        name: 'id',
        label: 'ID',
        type: 'Simple text',
        visible: true,
    },
    {
        name: 'name',
        label: 'name',
        type: 'Simple text',
        visible: true,
    },
]

describe('EntityTable component', () => {

    it("renders table", async () => {
        render(
            <Provider store={store}>
                <Router>
                    <EntityTableComp
                        entityCategory={EDBEntity.CustomEntity}
                        listLabel="Entities"
                        getMany={async () => testData}
                        columns={columns}
                    />
                </Router>
            </Provider>

        );

        // Column names
        await screen.findByText(columns[0].label);
        await screen.findByText(columns[1].label);

        // Data
        await screen.findByText(testData.elements?.[0].name);
        await screen.findByText(testData.elements?.[1].name);
    });

});
