import { setStoreItem } from '@cromwell/core';
import { getRestApiClient } from '@cromwell/core-frontend';
import { Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from '@mui/icons-material';
import { Button, IconButton, InputAdornment, TextField } from '@mui/material';
import { withStyles } from '@mui/styles';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { ImagePicker } from '../../components/imagePicker/ImagePicker';
import { LoadingStatus } from '../../components/loadBox/LoadingStatus';
import styles from './Welcome.module.scss';


export default function WelcomePage() {
    const apiClient = getRestApiClient();
    const history = useHistory();
    const [showPassword, setShowPassword] = useState(false);
    const [submitPressed, setSubmitPressed] = useState(false);
    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [nameInput, setNameInput] = useState('');
    const [avatarInput, setAvatarInput] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const handleSubmitClick = async () => {
        setSubmitPressed(true);

        if (!emailInput || !passwordInput || !nameInput) {
            return;
        }

        setLoading(true);

        try {
            await apiClient.setUpCms({
                url: window.location.origin,
                user: {
                    fullName: nameInput,
                    email: emailInput,
                    password: passwordInput,
                    avatar: avatarInput,
                }
            });

            await apiClient.login({
                email: emailInput,
                password: passwordInput
            });
        } catch (e) {
            console.error(e);
        }

        checkAuth();

        setLoading(false);
    }

    const checkAuth = async () => {
        const userInfo = await apiClient.getUserInfo({ disableLog: true });
        if (userInfo) {
            setStoreItem('userInfo', userInfo);
            history?.push?.(`/`);
        }
    }

    return (
        <div className={styles.WelcomePage}>
            <div className={styles.wrapper}>
                <img src="/admin/static/logo_small_black.svg" width="100px" className={styles.logo} />
                <h1 className={styles.title}>Welcome to Cromwell CMS!</h1>
                <h3 className={styles.subtitle}>Let&apos;s create your account</h3>
                <div className={styles.inputForm}>
                    <div className={styles.userMainInfo}>
                        <ImagePicker
                            toolTip="Pick avatar"
                            onChange={setAvatarInput}
                            value={avatarInput}
                            className={styles.avatar}
                            hideSrc
                        />
                        <CssTextField
                            label="Name"
                            value={nameInput}
                            onChange={e => setNameInput(e.target.value)}
                            fullWidth
                            variant="standard"
                            error={nameInput === '' && submitPressed}
                            helperText={nameInput === '' && submitPressed ? "This field is required" : undefined}
                            id="name-input"
                        />
                    </div>

                    <CssTextField
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
                    <CssTextField
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
                    <Button
                        onClick={handleSubmitClick}
                        className={styles.createBtn}
                        disabled={loading}
                        color="primary"
                        variant="contained"
                    >Create</Button>
                </div>
            </div>
            <LoadingStatus isActive={loading} />
        </div>
    );
}


const CssTextField = withStyles({
    root: {
    },
})(TextField);