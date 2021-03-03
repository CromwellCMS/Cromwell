import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import Autocomplete from './Autocomplete';

describe('Autocomplete component', () => {

    it("renders search content", async () => {
        render(<Autocomplete
            loader={async () => {
                return [
                    { title: '_test1_' }
                ]
            }}
            getOptionLabel={(item => item.title)}
            label="Autocomplete_label"
        />);

        await screen.findByText('Autocomplete_label');

        fireEvent.change(document.getElementsByTagName('input')?.[0],
            { target: { value: 'a' } })

        await screen.findByText('_test1_');
    });

})
