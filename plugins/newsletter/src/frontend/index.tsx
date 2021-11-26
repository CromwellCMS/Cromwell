import { getRestApiClient } from '@cromwell/core-frontend';
import { Alert, AlertProps, Button, InputUnstyled, Tooltip } from '@mui/material';
import React, { useState } from 'react';

import { StyledInputElement, useStyles } from './styles';

export default function NewsletterPlugin(): JSX.Element {
    const [email, setEmail] = useState('');
    const [hasSubscribed, setHasSubscribed] = useState(false);
    const [canValidate, setCanValidate] = useState(false);
    const classes = useStyles();

    const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

    const submit = async () => {
        if (!canValidate) setCanValidate(true);
        if (!validateEmail(email)) return;

        const client = getRestApiClient();
        try {
            const response = await client.post('plugin-newsletter/subscribe', {
                email
            });

            if (response) {
                setHasSubscribed(true);
            }
        } catch (e) {
            console.error('Newsletter::submit error: ', e)
        }
    }

    return (
        <div className={classes.subscribeInputContainer}>
            {hasSubscribed ? (
                <div>
                    <CustomAlert severity="success">Thank you for subscription!</CustomAlert>
                </div>
            ) : (<>
                <Tooltip open={canValidate && !validateEmail(email)}
                    title="Invalid e-mail"
                    arrow>
                    {/* <InputBase
                        className={classes.subscribeInput}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        inputComponent={(props) =>
                            <input {...props}
                                aria-label="Leave e-mail to subscribe for newsletter"
                            />}

                    /> */}
                    <InputUnstyled
                        components={{ Input: StyledInputElement }}
                        className={classes.subscribeInput}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Tooltip>
                <Button
                    onClick={submit}
                    variant="contained"
                    color="primary"
                    className={classes.subscribeBtn}>Subscribe!</Button>
            </>)}
        </div >
    )
}

function CustomAlert(props: AlertProps) {
    return <Alert elevation={6} variant="filled" {...props} />;
}