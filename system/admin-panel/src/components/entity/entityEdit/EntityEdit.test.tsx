import React from 'react';
import { EDBEntity, TBasePageEntity, TProductCategory } from '@cromwell/core';

const testData: TProductCategory = {
    id: 1,
    slug: '_test1_',
};

jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        withRouter: comp => comp,
        BrowserRouter: originalModule.BrowserRouter,
        Link: () => <></>,
    }
});

jest.mock('@cromwell/core-frontend', () => {
    return {
        CList: () => {
            return <div>...list</div>
        },
        getRestApiClient: () => {
            return {
                getCmsStatus: () => null,
            }
        },
    }
});


import { render, screen } from '@testing-library/react';
import EntityEdit from './EntityEdit';


describe('EntityEdit page', () => {

    it("renders EntityEdit", async () => {
        render(<EntityEdit
            entityCategory={EDBEntity.CustomEntity}
            listLabel="Custom"
            getById={async (): Promise<TBasePageEntity> => testData}
            //@ts-ignore
            match={{ params: { id: 1 } }}
        />);

        await screen.findByDisplayValue(testData.slug);
    });
})
