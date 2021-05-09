import { gql } from '@apollo/client';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { Button, InputBase, Tooltip } from '@material-ui/core';
import { Alert, AlertProps } from '@material-ui/lab';
import React, { useState } from 'react';

import { useStyles } from './styles';

export default function NewsletterPlugin(): JSX.Element {
    const [email, setEmail] = useState('');
    const [hasSubscribed, setHasSubscribed] = useState(false);
    const [canValidate, setCanValidate] = useState(false);
    const classes = useStyles();

    const validateEmail = (email) => {
        if (!canValidate) setCanValidate(true);

        if (/\S+@\S+\.\S+/.test(email)) {
            return true;
        } else {
            return false;
        }
    }

    const submit = async () => {
        if (!validateEmail(email)) return;

        const client = getGraphQLClient('plugin');
        try {
            const response = await client?.query({
                query: gql`
                    query pluginNewsletterSubscribe($email: String!) {
                        pluginNewsletterSubscribe(email: $email)
                    }
                `,
                variables: {
                    email
                }
            });

            if (response?.data?.pluginNewsletterSubscribe) {
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
                    <CustomAlert severity="success">You are subscribed!</CustomAlert>
                </div>
            ) : (
                <>
                    <Tooltip open={canValidate && !validateEmail(email)}
                        title="Invalid e-mail"
                        // title={
                        //     <CustomAlert severity="warning">Invalid e-mail</CustomAlert>
                        // }
                        arrow>
                        <InputBase className={classes.subscribeInput}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Tooltip>
                    <Button
                        onClick={submit}
                        variant="contained"
                        color="primary"
                        className={classes.subscribeBtn}>Subscribe!</Button>
                </>
            )
            }

        </div >
    )
}

function CustomAlert(props: AlertProps) {
    return <Alert elevation={6} variant="filled" {...props} />;
}