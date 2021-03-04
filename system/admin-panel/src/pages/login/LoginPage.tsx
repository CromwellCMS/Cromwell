import { getRestAPIClient } from '@cromwell/core-frontend';
import { setStoreItem } from '@cromwell/core';
import { Button, IconButton, InputAdornment, TextField, withStyles } from '@material-ui/core';
import {
    AccountCircle as AccountCircleIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
} from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import styles from './LoginPage.module.scss';

const LoginPage = () => {
    const apiClient = getRestAPIClient();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const history = useHistory();

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const handleLoginClick = async () => {
        setLoading(true);
        try {
            await apiClient.login({
                email: emailInput,
                password: passwordInput
            });
            checkAuth();
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    }

    const checkAuth = async () => {
        const userInfo = await apiClient.getUserInfo();
        if (userInfo) {
            setStoreItem('userInfo', userInfo);
            loginSuccess();
        }
    }

    useEffect(() => {
        checkAuth();
    }, []);

    const loginSuccess = () => {
        history?.push?.(`/`);
    }

    return (
        <div className={styles.LoginPage} style={{
            backgroundImage: 'url("/logo_bckgr_no_logo.png")'
        }}>
            <div className={styles.loginForm}>
                <AccountCircleIcon className={styles.loginIcon} />
                <CssTextField
                    label="E-mail"
                    value={emailInput}
                    className={styles.textField}
                    onChange={e => setEmailInput(e.target.value)}
                    fullWidth
                    id="email-input"
                />
                <CssTextField
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
                    onClick={handleLoginClick}
                    className={styles.loginBtn}
                    disabled={loading}
                    variant="outlined"
                    color="inherit">Login</Button>
            </div>
        </div>
    )
}

export default LoginPage;


const CssTextField = withStyles({
    root: {
        borderColor: '#fff',
        color: "#fff",

        '& label': {
            color: '#fff',
        },
        '& label.Mui-focused': {
            color: '#fff',
        },
        '& .MuiInput-underline:before': {
            borderBottomColor: '#ccc',
        },
        '& .MuiInput-underline:hover:before': {
            borderBottomColor: '#fff',
        },
        '& .MuiInput-input': {
            color: '#fff',
        },

    },
})(TextField);