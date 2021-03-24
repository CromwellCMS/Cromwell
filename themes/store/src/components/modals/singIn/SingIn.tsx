import React, { useEffect, useState } from 'react';
import { getRestAPIClient } from '@cromwell/core-frontend';
import { setStoreItem, TUser } from '@cromwell/core';
import { toast } from 'react-toastify';
import {
    AccountCircle as AccountCircleIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
} from '@material-ui/icons';
import { Button, Modal, TextField, InputAdornment, IconButton } from '@material-ui/core';
import commonStyles from '../../../styles/common.module.scss';
import styles from './SignIn.module.scss';


export default function SingIn(props: {
    open: boolean;
    type: 'sign-in' | 'sign-up';
    onClose: () => void;
    onSignIn: (user: TUser) => void;
}) {
    const apiClient = getRestAPIClient();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [nameInput, setNameInput] = useState('');
    const [submitPressed, setSubmitPressed] = useState(false);

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

    return (
        <Modal
            className={commonStyles.center}
            open={props.open}
            onClose={props.onClose}
        >
            <div className={styles.SingIn}>
                <form className={styles.loginForm} onSubmit={handleLoginClick}>
                    <TextField
                        label="E-mail"
                        value={emailInput}
                        className={styles.textField}
                        onChange={e => setEmailInput(e.target.value)}
                        fullWidth
                        id="email-input"
                    />
                    {props.type === 'sign-up' && (
                        <TextField
                            label="Name"
                            value={nameInput}
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
