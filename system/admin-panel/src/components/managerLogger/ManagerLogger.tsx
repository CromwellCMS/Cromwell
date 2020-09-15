import React, { useState, useEffect } from 'react';
import { getRestAPIClient, getWebSocketClient } from '@cromwell/core-frontend';
import { toast } from 'react-toastify';
import { Modal, IconButton } from '@material-ui/core';
import { HighlightOff as HighlightOffIcon } from '@material-ui/icons';
import classes from './ManagerLogger.module.scss';
import commonClasses from '../../styles/common.module.scss';

export const ManagerLogger = (props: { isActive: boolean }) => {
    const [log, setLog] = useState<string[]>([]);
    const [isModalActive, setIsModalActive] = useState<boolean>(false);
    const toastId = React.useRef<null | string | number>(null);
    const lastState = React.useRef<boolean>(false);
    const handleOpenModal = () => setIsModalActive(true);
    const wsClient = getWebSocketClient();

    if (props.isActive && !lastState.current) {
        // open logger
        setLog([]);
        wsClient?.connectToManager((message: string) => {
            setLog(prev => {
                return [...prev, message]
            })
        });

        toastId.current = toast(({ closeToast }) =>
            <Notification onClose={closeToast} onClick={handleOpenModal} />, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: false,
            onClick: handleOpenModal,
            // closeOnClick: false
        });
    }
    if (!props.isActive && lastState.current) {
        // close logger
        setTimeout(() => {
            if (toastId.current) toast.dismiss(toastId.current);
        }, 2000);
    }

    lastState.current = props.isActive;

    useEffect(() => {
        return () => {
            wsClient?.disconnectManager();
        }
    }, []);

    return (
        <Modal className={commonClasses.center}
            open={isModalActive}
            onClose={() => setIsModalActive(false)}
        >
            <div className={classes.logModal}>
                <div className={classes.logModalContent}>
                    {log.map((message, i) => {
                        return (
                            <p key={i}>{message}</p>
                        )
                    })}
                </div>
            </div>
        </Modal>
    )
}

const Notification = (props: {
    onClose?: () => void;
    onClick: () => void;
}) => {
    return (
        <div className={classes.notification}>
            <p className={classes.notificationLink} onClick={props.onClick}>Connect to Server log</p>
            {/* <IconButton
                aria-label="open"
                onClick={props.onClose}
            >
                <HighlightOffIcon />
            </IconButton> */}
        </div>
    )
}
