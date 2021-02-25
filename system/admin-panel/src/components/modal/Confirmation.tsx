import React from 'react';
import {
    // Modal,
    Button
} from '@material-ui/core';
import styles from './Confirmation.module.scss'
import commonStyles from '../../styles/common.module.scss';
import Modal from './Modal';

const ConfirmationModal = (props: {
    title: string;
    open: boolean;
    onClose?: () => void;
    onConfirm?: () => void;
}) => {

    return (
        <Modal
            open={props.open}
            onClose={props.onClose}
            className={commonStyles.center}
            blurSelector="#root"
        >
            <div className={styles.ConfirmationModal}>
                <p className={styles.text}>{props.title}</p>
                <div className={styles.actions}>
                    <Button
                        role="button"
                        variant="outlined"
                        color="primary"
                        onClick={props.onClose}
                        className={styles.actionBtn}
                    >Cancel</Button>
                    <Button
                        role="button"
                        variant="contained"
                        color="primary"
                        onClick={props.onConfirm}
                        className={styles.actionBtn}
                    >Ok</Button>
                </div>
            </div>
        </Modal>
    )
};

export default ConfirmationModal;

export const modalStyles = styles;