import { setStoreItem } from '@cromwell/core';
import { getRestAPIClient } from '@cromwell/core-frontend';
import { Button, IconButton, InputAdornment, TextField } from '@material-ui/core';
import { Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { toast } from '../../components/toast/toast';
import styles from './LoginPage.module.scss';

export type TFromType = 'sign-in' | 'sign-up' | 'forgot-pass' | 'reset-pass';

const LoginPage = () => {
    const apiClient = getRestAPIClient();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [emailInput, setEmailInput] = useState('');
    const [codeInput, setCodeInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const history = useHistory();
    const [formType, setFormType] = useState<TFromType>('sign-in');

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const handleLoginClick = async () => {
        if (!emailInput || emailInput == '' || !passwordInput || passwordInput === '') return;

        setLoading(true);
        try {
            await apiClient.login({
                email: emailInput,
                password: passwordInput
            }, { disableLog: true });
            checkAuth(true);
        } catch (e) {
            toast.error('Incorrect email or password');
            console.error(e);
        }
        setLoading(false);
    }

    const checkAuth = async (showError?: boolean) => {
        const userInfo = await apiClient.getUserInfo();
        if (userInfo) {
            setStoreItem('userInfo', userInfo);
            loginSuccess();
        } else {
            if (showError)
                toast.error('Incorrect email or password');
        }
    }

    useEffect(() => {
        checkAuth();
    }, []);

    const loginSuccess = () => {
        history?.push?.(`/`);
    }

    const handleSubmit = () => {
        if (formType === 'sign-in') handleLoginClick();
        if (formType === 'forgot-pass') handleForgotPass();
        if (formType === 'reset-pass') handleResetPass();
    }

    const handleGoToForgotPass = () => {
        setFormType('forgot-pass');
    }

    const handleForgotPass = async () => {
        if (!emailInput || emailInput == '') return;
        setLoading(true);

        try {
            const success = await apiClient?.forgotPassword({ email: emailInput }, { disableLog: true });
            if (success) {
                toast.success('We sent you an e-mail');
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

    const handleResetPass = async () => {
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
                toast.success('Password has been reset.');
                setFormType('sign-in');
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
                setCodeInput('')
                setFormType('sign-in');
            } else {
                toast.error?.('Incorrect e-mail or user was not found');
            }
        }
        setLoading(false);
    }

    return (
        <div className={styles.LoginPage}>
            <form className={styles.loginForm} onSubmit={handleSubmit}>
                <img src="/admin/static/logo_small.png" width="150px" className={styles.logo} />
                {formType === 'sign-in' && (
                    <>
                        <TextField
                            label="E-mail"
                            value={emailInput}
                            className={styles.textField}
                            onChange={e => setEmailInput(e.target.value)}
                            fullWidth
                            id="email-input"
                        />
                        <TextField
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            value={passwordInput}
                            onChange={e => setPasswordInput(e.target.value)}
                            className={styles.textField}
                            fullWidth
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
                        <Button
                            type="submit"
                            onClick={handleLoginClick}
                            className={styles.loginBtn}
                            disabled={loading}
                            variant="outlined"
                            color="inherit">Login</Button>
                        <p onClick={handleGoToForgotPass} className={styles.forgotPassText}>Forgot password?</p>
                    </>
                )}
                {formType === 'forgot-pass' && (
                    <>
                        <TextField
                            label="E-mail"
                            value={emailInput}
                            className={styles.textField}
                            onChange={e => setEmailInput(e.target.value)}
                            fullWidth
                            id="email-input"
                        />
                        <Button
                            type="submit"
                            onClick={handleForgotPass}
                            className={styles.loginBtn}
                            disabled={loading}
                            variant="outlined"
                            color="inherit">Reset password</Button>
                        <p onClick={() => setFormType('sign-in')} className={styles.forgotPassText}>back</p>
                    </>
                )}
                {formType === 'reset-pass' && (
                    <>
                        <p className={styles.resetPassInstructions}>We sent you an e-mail with reset code. Copy the code below and create a new password</p>
                        <TextField
                            label="Code"
                            value={codeInput}
                            className={styles.textField}
                            onChange={e => setCodeInput(e.target.value)}
                            fullWidth
                            id="code-input"
                        />
                        <TextField
                            label="New password"
                            type={showPassword ? 'text' : 'password'}
                            value={passwordInput}
                            onChange={e => setPasswordInput(e.target.value)}
                            className={styles.textField}
                            fullWidth
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
                        <Button
                            type="submit"
                            onClick={handleResetPass}
                            className={styles.loginBtn}
                            disabled={loading}
                            variant="outlined"
                            color="inherit">Change password</Button>
                    </>
                )}
            </form>
        </div>
    )
}

export default LoginPage;