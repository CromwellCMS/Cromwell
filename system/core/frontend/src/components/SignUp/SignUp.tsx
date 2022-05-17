import { TUser } from '@cromwell/core';
import clsx from 'clsx';
import React, { useState } from 'react';

import { TAuthClientOperationResult, useAuthClient } from '../../helpers/AuthClient';
import { BaseButton, TBaseButton } from '../BaseElements/BaseButton';
import { BaseTextField, TBaseTextField } from '../BaseElements/BaseTextField';
import styles from './SignUp.module.scss';

type TSubmitEvent = React.FormEvent<HTMLFormElement> | React.MouseEvent<Element, MouseEvent>;

export type SignUpProps = {
    /**
     * CSS classes to pass to elements
     */
    classes?: Partial<Record<'root', string>>;

    /**
     * Translate/change text on elements
     */
    text?: {
        fieldRequired?: string;
        signUpButton?: string;
    }

    /**
     * Custom components to override default ones
     */
    elements?: {
        Button?: TBaseButton;
        TextField?: TBaseTextField;
        EmailField?: TBaseTextField;
        NameField?: TBaseTextField;
        PasswordField?: TBaseTextField;
    }

    /**
     * Specify user roles to use. Make sure sure roles configured in the admin panel for registration. 
     * `["customer"]` by default
     */
    signUpRoles?: string[];

    /**
     * Called when user successfully registered
     */
    onSignUpSuccess?: (user: TUser, password: string) => any;

    /**
     * Called when user tried to register and get an error;
     * Error represented by code:
     * 0 - Incorrect e-mail or password or e-mail already has been taken
     * 1 - Too many requests
     */
    onSignUpError?: (error: TAuthClientOperationResult) => any;
}

export function SignUp(props: SignUpProps) {
    const { classes, elements, text } = props;
    const { TextField = BaseTextField, Button = BaseButton } = elements ?? {};
    const { EmailField = TextField, PasswordField = TextField, NameField = TextField } = elements ?? {};
    const authClient = useAuthClient();

    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [submitPressed, setSubmitPressed] = useState(false);
    const [nameInput, setNameInput] = useState('');

    const handleSignUp = async (e: TSubmitEvent) => {
        e.preventDefault();
        setSubmitPressed(true);

        const result = await authClient.signUp({
            email: emailInput,
            password: passwordInput,
            fullName: nameInput,
            roles: props.signUpRoles ?? ['customer'],
        });
        if (result.success && result.user) {
            props?.onSignUpSuccess?.(result.user, passwordInput);
        } else {
            props?.onSignUpError?.(result);
        }
    }

    const fieldRequiredText = text?.fieldRequired ?? "This field is required";

    return (
        <form className={clsx(styles.SignUp, classes?.root)} onSubmit={handleSignUp}>
            <EmailField
                label="E-mail"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                fullWidth
                variant="standard"
                error={!emailInput && submitPressed}
                helperText={!emailInput && submitPressed ? fieldRequiredText : undefined}
                className={styles.signUpField}
            />
            <NameField
                label="Name"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                fullWidth
                variant="standard"
                error={nameInput === '' && submitPressed}
                helperText={nameInput === '' && submitPressed ? "This field is required" : undefined}
                className={styles.signUpField}
            />
            <PasswordField
                label="Password"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                fullWidth
                variant="standard"
                error={!passwordInput && submitPressed}
                helperText={!passwordInput && submitPressed ? fieldRequiredText : undefined}
                className={styles.signUpField}
            />
            <Button type="submit"
                onClick={handleSignUp}
                disabled={authClient.isPending}
                className={styles.signUpSubmitBtn}
            >{text?.signUpButton ?? 'Sign up'}</Button>
        </form>
    )
}
