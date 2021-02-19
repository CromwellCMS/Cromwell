jest.mock('next/link', () => {
    return {
        __esModule: true,
        default: undefined,
    }
});


import { render, screen } from '@testing-library/react';
import React from 'react';

import { ProductAttributes } from './ProductAttributes';

describe('ProductAttributes', () => {

    it("renders attributes", async () => {
        render(<ProductAttributes
            onChange={() => { }}
            product={{
                name: '_test1_',
                id: '1',
                categories: [],
                attributes: [
                    {
                        key: 'test_attr',
                        values: [
                            {
                                value: '_test_val_1_'
                            }
                        ]
                    }
                ]
            }}
            attributes={[
                {
                    id: '1',
                    type: 'radio',
                    key: 'test_attr',
                    values: [
                        {
                            value: '_test_val_1_',
                        }
                    ]
                }
            ]}
        />);

        await screen.findByText('_test_val_1_');
    });

})
