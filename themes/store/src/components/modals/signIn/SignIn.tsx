import { TUser } from '@cromwell/core';
import { getRestApiClient } from '@cromwell/core-frontend';
import { Button, IconButton, InputAdornment, Tab, Tabs, TextField } from '@mui/material';
import React, { useState } from 'react';

import commonStyles from '../../../styles/common.module.scss';
import { VisibilityIcon, VisibilityOffIcon } from '../../icons';
import { toast } from '../../toast/toast';
import Modal from '../baseModal/Modal';
import styles from './SignIn.module.scss';


export type TFromType = 'sign-in' | 'sign-up' | 'forgot-pass' | 'reset-pass';

export default function SingIn(props: {
    open: boolean;
    type: TFromType;
    onClose: () => any;
    onSignIn: (user: TUser) => any;
}) {
    const apiClient = getRestApiClient();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [nameInput, setNameInput] = useState('');
    const [codeInput, setCodeInput] = useState('');
    const [submitPressed, setSubmitPressed] = useState(false);
    const [activeTab, setActiveTab] = useState<number | null>(props.type === 'sign-up' ? 1 : 0);
    const [formType, setFormType] = useState<TFromType>(props.type);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const handleLoginClick = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setSubmitPressed(true);

        if (!emailInput || emailInput == '' || !passwordInput || passwordInput === '') return;

        setLoading(true);
        try {
            const user = await apiClient?.login({
                email: emailInput,
                password: passwordInput
            });
            if (user?.id) {
                props.onSignIn(user);
            } else {
                throw new Error('!user');
            }
        } catch (e) {
            console.error(e);
            let info = e?.message;
            try {
                info = JSON.parse(e.message)
            } catch (e) { }

            if (info?.statusCode === 429) {

            } else {
                toast.error('Incorrect email or password');
            }
        }
        setLoading(false);
    }

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setSubmitPressed(true);

        if (!emailInput || emailInput == '' || !passwordInput
            || passwordInput === '' || !nameInput || nameInput === '') return;

        setLoading(true);
        try {
            const user = await apiClient?.signUp({
                email: emailInput,
                password: passwordInput,
                fullName: nameInput,
            });

            await apiClient?.login({
                email: emailInput,
                password: passwordInput,
            });

            if (user?.id) {
                props.onSignIn(user);
                toast.success('Created new account!');
            } else {
                throw new Error('!user');
            }
        } catch (e) {
            console.error(e);
            let info = e?.message;
            try {
                info = JSON.parse(e.message)
            } catch (e) { }

            if (info?.statusCode === 429) {

            } else {
                toast.error?.('Incorrect e-mail or password or e-mail already has been taken');
            }
        }
        setLoading(false);
    }

    const handleForgotPass = async (e) => {
        e.preventDefault();
        setSubmitPressed(true);

        if (!emailInput || emailInput == '') return;

        setLoading(true);
        try {
            const success = await apiClient?.forgotPassword({ email: emailInput });
            if (success) {
                toast.success('We sent you an e-mail');
                setSubmitPressed(false);
                setFormType('reset-pass');
            } else {
                throw new Error('!success');
            }
        } catch (e) {
            console.error(e);
            let info = e?.message;
            try {
                info = JSON.parse(e.message)
            } catch (e) { }

            if (info?.statusCode === 429) {

            } else {
                toast.error?.('Incorrect e-mail or user was not found');
            }
        }
        setLoading(false);
    }

    const handleResetPass = async (e) => {
        e.preventDefault();
        setSubmitPressed(true);

        if (!emailInput || emailInput == '' || !codeInput || codeInput === ''
            || !passwordInput || passwordInput === '') return;

        setLoading(true);
        try {
            const success = await apiClient?.resetPassword({
                email: emailInput,
                code: codeInput,
                newPassword: passwordInput,
            });
            if (success) {
                toast.success('Password has been changed.');
                setSubmitPressed(false);
                setFormType('sign-in');
                setActiveTab(0);
            } else {
                throw new Error('!success');
            }
        } catch (e) {
            console.error(e);
            let info = e?.message;
            try {
                info = JSON.parse(e.message)
            } catch (e) { }

            if (info?.statusCode === 429) {

            } else if (info?.statusCode === 417) {
                toast.error?.('Exceeded reset password attempts');
                setSubmitPressed(false);
                setCodeInput('')
                setFormType('sign-in');
                setActiveTab(0);
            } else {
                toast.error?.('Incorrect e-mail or user was not found');
            }
        }
        setLoading(false);
    }

    const handleTabChange = (event: React.ChangeEvent<unknown>, newValue: number) => {
        setActiveTab(newValue);
        if (newValue === 1) setFormType('sign-up');
        if (newValue === 0) setFormType('sign-in');
    };

    return (
        <Modal
            className={commonStyles.center}
            open={props.open}
            onClose={props.onClose}
            blurSelector={"#CB_root"}
        >
            <div className={styles.SingIn}>
                <Tabs
                    className={styles.tabs}
                    value={activeTab}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={handleTabChange}
                >
                    <Tab
                        className={styles.tab}
                        label="Sign in" />
                    <Tab
                        className={styles.tab}
                        label="Sign up" />
                </Tabs>
                <form className={styles.loginForm} onSubmit={formType === 'sign-in' ? handleLoginClick : handleSignUp} >
                    {(formType === 'reset-pass') && (
                        <p className={styles.resetPassInstructions}>We sent you an e-mail with reset code. Copy the code below and create a new password</p>
                    )}
                    <TextField
                        label="E-mail"
                        value={emailInput}
                        className={styles.textField}
                        onChange={e => setEmailInput(e.target.value)}
                        fullWidth
                        variant="standard"
                        error={emailInput === '' && submitPressed}
                        helperText={emailInput === '' && submitPressed ? "This field is required" : undefined}
                        id="email-input"
                    />
                    {formType === 'sign-up' && (
                        <TextField
                            label="Name"
                            value={nameInput}
                            className={styles.textField}
                            onChange={e => setNameInput(e.target.value)}
                            fullWidth
                            variant="standard"
                            error={nameInput === '' && submitPressed}
                            helperText={nameInput === '' && submitPressed ? "This field is required" : undefined}
                            id="name-input"
                        />
                    )}
                    {formType === 'reset-pass' && (
                        <TextField
                            label="Code"
                            value={codeInput}
                            className={styles.textField}
                            onChange={e => setCodeInput(e.target.value)}
                            fullWidth
                            variant="standard"
                            error={codeInput === '' && submitPressed}
                            helperText={codeInput === '' && submitPressed ? "This field is required" : undefined}
                            id="name-input"
                        />
                    )}
                    {(formType === 'sign-up' || formType == 'sign-in' || formType === 'reset-pass') && (
                        <TextField
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            value={passwordInput}
                            onChange={e => setPasswordInput(e.target.value)}
                            className={styles.textField}
                            fullWidth
                            variant="standard"
                            error={passwordInput === '' && submitPressed}
                            helperText={passwordInput === '' && submitPressed ? "This field is required" : undefined}
                            id="password-input"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    )}
                    {formType === 'sign-in' && (
                        <p className={styles.forgotPassText} onClick={() => {
                            setActiveTab(null)
                            setFormType('forgot-pass')
                        }}>Forgot your password?</p>
                    )}
                    {formType === 'sign-in' && (
                        <Button
                            type="submit"
                            onClick={handleLoginClick}
                            className={styles.loginBtn}
                            disabled={loading}
                            variant="outlined"
                            color="inherit">Login</Button>
                    )}
                    {formType === 'sign-up' && (
                        <Button
                            type="submit"
                            onClick={handleSignUp}
                            className={styles.loginBtn}
                            disabled={loading}
                            variant="outlined"
                            color="inherit">Sign up</Button>
                    )}
                    {formType === 'forgot-pass' && (
                        <Button
                            type="submit"
                            onClick={handleForgotPass}
                            className={styles.loginBtn}
                            disabled={loading}
                            variant="outlined"
                            color="inherit">Reset password</Button>
                    )}
                    {formType === 'reset-pass' && (
                        <Button
                            type="submit"
                            onClick={handleResetPass}
                            className={styles.loginBtn}
                            disabled={loading}
                            variant="outlined"
                            color="inherit">Change password</Button>
                    )}
                </form>
            </div>
        </Modal >
    )
}
