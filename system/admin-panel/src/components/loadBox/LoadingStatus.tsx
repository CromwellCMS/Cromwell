import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

import Loadbox from './LoadBox';
import styles from './LoadBox.module.scss';


export const LoadingStatus = (props: { isActive: boolean }) => {
    const lastState = React.useRef<boolean>(false);
    const toastId = React.useRef<null | string | number>(null);

    useEffect(() => {
        return () => {
            if (toastId.current) toast.dismiss(toastId.current);
        }
    }, []);

    if (props.isActive && !lastState.current) {
        // open loader
        if (toastId.current) toast.dismiss(toastId.current);

        toastId.current = toast(({ closeToast }) =>
            <div
                className={styles.LoadingStatus}
            ><Loadbox size={44} /></div>, {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: false,
            closeButton: false,
            className: styles.loadContainer,
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