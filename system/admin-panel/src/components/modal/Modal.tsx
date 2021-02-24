import MuiModal from '@material-ui/core/Modal';
import React, { useEffect } from 'react';

import styles from './Modal.module.scss';

const Modal = (props: {
    children: React.ReactNode;
    open: boolean;
    onClose?: () => void;
    blurSelector?: string;
    className?: string;
    disableEnforceFocus?: boolean;
}) => {
    useEffect(() => {
        if (props.blurSelector) {
            const elem = document.querySelector(props.blurSelector) as HTMLElement;
            if (elem) {
                if (props.open) {
                    elem.style.filter = 'blur(4px)';
                } else {
                    elem.style.filter = '';
                }
            }
        }
    }, [props.open]);

    return (
        <MuiModal
            disableEnforceFocus={props.disableEnforceFocus}
            open={props.open}
            onClose={props.onClose}
            className={styles.Modal}
        >
            <div className={`${styles.modalContent} ${props.className ?? ''}`}>
                {props.children}
            </div>
        </MuiModal>
    );
}

export default Modal;