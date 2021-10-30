import { render, screen } from '@testing-library/react';
import React from 'react';
import loadable from '@loadable/component';
import { TPagedList, TProductReview } from '@cromwell/core';


const testData: TPagedList<TProductReview> = {
    pagedMeta: { totalElements: 2, pageNumber: 1, pageSize: 2, totalPages: 1 },
    elements: [
        {
            id: 1,
            productId: 1,
            userName: '_test1_',
        },
        {
            id: 2,
            productId: 2,
            userName: '_test2_',
        }
    ]
};


jest.mock('../../constants/PageInfos', () => {
    return {
        productPageInfo: {},
    }
});

jest.mock('@cromwell/core-frontend', () => {
    return {
        CList: (props: any) => {
            const Comp = loadable(async () => {
                const items: TPagedList<TProductReview> = await props.loader();
                const ListItem = props.ListItem;
                return () => (
                    <div>
                        {items.elements.map(it => {
                            return <ListItem key={it.id} data={it} />
                        })}
                    </div>
                )
            });
            return <Comp />;
        },
        getGraphQLClient: () => {
            return {
                getFilteredProductReviews: jest.fn().mockImplementation(() => testData)
            }
        },
        getCStore: () => ({
            getPriceWithCurrency: () => '',
        }),
        getRestApiClient: () => {
            return {
                getCmsStatus: () => null,
            }
        },
    }
});

import { Provider } from 'react-redux-ts';
import ProductReviewPage from './ReviewList';
import { BrowserRouter as Router } from 'react-router-dom';
import { store } from '../../redux/store';

describe('ProductReview page', () => {

    it("renders reviews", async () => {
        render(
            <Provider store={store}>
                <Router>
                    <ProductReviewPage />
                </Router>
            </Provider>
        );

        await screen.findByText('_test1_');
        await screen.findByText('_test2_');
    });

})
