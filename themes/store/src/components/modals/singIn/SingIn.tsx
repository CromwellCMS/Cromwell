import React, { useEffect, useState } from 'react';
import { getRestAPIClient } from '@cromwell/core-frontend';
import { setStoreItem, TUser } from '@cromwell/core';
import { observer } from 'mobx-react';
import { toast } from 'react-toastify';
import {
    AccountCircle as AccountCircleIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
} from '@material-ui/icons';
import { Button, TextField, InputAdornment, IconButton, Tabs, Tab } from '@material-ui/core';
import commonStyles from '../../../styles/common.module.scss';
import styles from './SignIn.module.scss';
import Modal from '../baseModal/Modal'

type TFromType = 'sign-in' | 'sign-up';

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
    const [activeTab, setActiveTab] = useState(0);
    const [formType, setFormType] = useState<TFromType>(props.type);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const handleLoginClick = async () => {
        setSubmitPressed(true);

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
            toast.error('Incorrect email or password');
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
                <form className={styles.loginForm} onSubmit={handleLoginClick}>
                    <TextField
                        label="E-mail"
                        value={emailInput}
                        className={styles.textField}
                        onChange={e => setEmailInput(e.target.value)}
                        fullWidth
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
                </form>
            </div>
        </Modal >
    )
}
