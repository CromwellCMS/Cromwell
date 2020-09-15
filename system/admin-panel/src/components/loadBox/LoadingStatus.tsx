import React from 'react';
import { toast } from 'react-toastify';
import Loadbox from './LoadBox';
import { createStyles, makeStyles, Theme } from '@material-ui/core';

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        loadContainer: {
            width: '64px',
            margin: '0 0 0 auto',
            borderRadius: '70px'
        }
    }),
);

export const LoadingStatus = (props: { isActive: boolean }) => {
    const lastState = React.useRef<boolean>(false);
    const toastId = React.useRef<null | string | number>(null);
    const classes = useStyles();

    if (props.isActive && !lastState.current) {
        // open loader
        if (toastId.current) toast.dismiss(toastId.current);

        toastId.current = toast(({ closeToast }) =>
            <Notification />, {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: false,
            closeButton: false,
            className: classes.loadContainer,
            closeOnClick: false
        });
    }
    if (!props.isActive && lastState.current) {
        // close loader
        if (toastId.current) toast.dismiss(toastId.current);
    }

    lastState.current = props.isActive;

    return (
        <></>
    )
}

const Notification = () => {
    return (
        <div style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center'
        }}>
            <Loadbox size={44} />
        </div>
    )
}
