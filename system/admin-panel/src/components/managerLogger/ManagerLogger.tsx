import React, { useState, useEffect } from 'react';
import { getRestAPIClient, getWebSocketClient } from '@cromwell/core-frontend';
import { toast } from 'react-toastify';
import { Modal, IconButton } from '@material-ui/core';
import { HighlightOff as HighlightOffIcon } from '@material-ui/icons';
import classes from './ManagerLogger.module.scss';

export const ManagerLogger = () => {
    const [log, setLog] = useState<string[]>([]);
    const [isModalActive, setIsModalActive] = useState<boolean>(false);
    const toastId = React.useRef<null | string | number>(null);
    const handleOpenModal = () => setIsModalActive(true);
    console.log('log', log)
    useEffect(() => {
        const wsClient = getWebSocketClient();
        wsClient?.connectToManager((message: string) => {
            setLog(prev => {
                return [...prev, message]
            })
        });

        toastId.current = toast(({ closeToast }) =>
            <Notification onClose={closeToast} onClick={handleOpenModal} />, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: false
        });

        return () => {
            if (toastId.current) toast.dismiss(toastId.current);
        }
    }, [])

    return (
        <div>
            <Modal
                open={isModalActive}
                onClose={() => setIsModalActive(false)}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div>
                    {log.map(message => {
                        <p>{message}</p>
                    })}
                </div>
            </Modal>
        </div>
    )
}

const Notification = (props: {
    onClose?: () => void;
    onClick: () => void
}) => {
    return (
        <div className={classes.notification}>
            <p className={classes.notificationLink} onClick={props.onClick}>Open log</p>
            <IconButton
                aria-label="open"
                onClick={props.onClose}
            >
                <HighlightOffIcon />
            </IconButton>
        </div>
    )
}
