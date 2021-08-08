import { render, screen } from '@testing-library/react';
import React from 'react';

const testData = {
    id: '_test1_',
    name: '_test1_',
}

jest.mock('@cromwell/core-frontend', () => {
    return {
        ...jest.requireActual('@cromwell/core-frontend'),
        getRestAPIClient: () => {
            return {
                createPaymentSession: () => ({
                    orderTotalPrice: 10,
                    cart: [{
                        product: testData
                    }]
                }),
            }
        },
    }
});

jest.mock('@material-ui/core', () => {
    return {
        ...jest.requireActual('@material-ui/core'),
        useMediaQuery: () => false,
    }
});

import { getCStore } from '@cromwell/core-frontend';
import CheckoutPage from '../../src/pages/checkout';


describe('/checkout', () => {

    it("renders cart", async () => {
        const cstore = getCStore();
        cstore.addToCart({
            product: testData
        })

        render(<CheckoutPage />);
        await screen.findByText(testData.name);
    });

    it("requests and renders order total", async () => {
        render(<CheckoutPage />);

        const cstore = getCStore();
        await screen.findByText(cstore.getPriceWithCurrency(10));
    });

})
