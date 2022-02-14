import { render, screen } from '@testing-library/react';
import React from 'react';

import { SignIn } from './SignIn';

describe('SignIn', () => {

    it("renders SignIn", async () => {
        render(<SignIn />);
        await screen.findByText('Login');
    });


    it("switches to forgot password", async () => {
        render(<SignIn />);
        await screen.findByText('Forgot your password?');

        screen.getByText('Forgot your password?').click();
        // "Reset password" button
        await screen.findByText('Reset password');
    });
})
