import React, { useEffect, useState } from 'react';
import { getRestAPIClient } from '@cromwell/core-frontend';
import { setStoreItem, TUser } from '@cromwell/core';
import { observer } from 'mobx-react';
import {
    AccountCircle as AccountCircleIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
} from '@material-ui/icons';
import { Button, TextField, InputAdornment, IconButton, Tabs, Tab } from '@material-ui/core';
import commonStyles from '../../../styles/common.module.scss';
import styles from './SignIn.module.scss';
import Modal from '../baseModal/Modal'
import { toast } from '../../toast/toast';


export type TFromType = 'sign-in' | 'sign-up';

export default function SingIn(props: {
    open: boolean;
    type: TFromType;
    onClose: () => any;
    onSignIn: (user: TUser) => any;
}) {
    const apiClient = getRestAPIClient();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [nameInput, setNameInput] = useState('');
    const [submitPressed, setSubmitPressed] = useState(false);
    const [activeTab, setActiveTab] = useState(props.type === 'sign-up' ? 1 : 0);
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
                toast.error?.('Incorrect email or password');
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

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
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
                    <TextField
                        label="E-mail"
                        value={emailInput}
                        className={styles.textField}
                        onChange={e => setEmailInput(e.target.value)}
                        fullWidth
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
                            error={nameInput === '' && submitPressed}
                            helperText={nameInput === '' && submitPressed ? "This field is required" : undefined}
                            id="name-input"
                        />
                    )}
                    <TextField
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        value={passwordInput}
                        onChange={e => setPasswordInput(e.target.value)}
                        className={styles.textField}
                        fullWidth
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
                    {formType === 'sign-in' ? (
                        <Button
                            type="submit"
                            onClick={handleLoginClick}
                            className={styles.loginBtn}
                            disabled={loading}
                            variant="outlined"
                            color="inherit">Login</Button>
                    ) : (
                        <Button
                            type="submit"
                            onClick={handleSignUp}
                            className={styles.loginBtn}
                            disabled={loading}
                            variant="outlined"
                            color="inherit">Sign up</Button>
                    )}

                </form>
            </div>
        </Modal >
    )
}
