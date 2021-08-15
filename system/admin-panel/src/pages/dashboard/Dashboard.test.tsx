import React from 'react';
import { TCmsStats } from '@cromwell/core';

const testData: TCmsStats = {
    reviews: 0,
    averageRating: 0,
    pages: 0,
    orders: 0,
    pageViews: 6666,
    topPageViews: [],
    salesValue: 999,
    salesPerDay: [],
    customers: 0,
};

jest.mock('@cromwell/core-frontend', () => {
    return {
        getGraphQLClient: () => {
            return {
                getProductReviews: jest.fn().mockImplementation(() => undefined),
            }
        },
        getRestApiClient: () => {
            return {
                getCmsStats: jest.fn().mockImplementation(() => testData),
                getCmsStatus: () => null,
            }
        },
        getCStore: () => {
            return {
                getActiveCurrencySymbol: jest.fn().mockImplementation(() => ''),
            }
        },
        getWidgetsForPlace: () => [<></>],
        onWidgetRegister: () => null,
    }
});

jest.mock('countup.js', () => {
    return {
        CountUp: () => {
            return {
                start: jest.fn().mockImplementation(() => undefined),
            }
        },
    }
});

jest.mock('echarts', () => {
    return {
        init: () => {
            return {
                setOption: () => null,
            }
        },
    }
});
jest.mock('react-resize-detector', () => {
    return () => <></>;
});
jest.mock('@material-ui/lab', () => {
    return {
        Rating: () => <></>,
    }
});

import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import DashboardPage from './Dashboard';


describe('Dashboard page', () => {

    it("renders stats", async () => {
        render(<Router><DashboardPage /></Router>);

        await screen.findByText(testData.pageViews + '');
        await screen.findByText(testData.salesValue + '');
    });
})
